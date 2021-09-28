const serverless = require("serverless-http");
const express = require("express");
const app = express();

const AWSXRay = require("aws-xray-sdk-core");
const awsMsg = require("aws-sdk");
const AWS = AWSXRay.captureAWS(awsMsg);
const sqs = new awsMsg.SQS({ apiVersion: "2012-11-05" });

exports.handler = app.get("/", (req, res, next) => {
  // Params object for SQS
  const params = {
    MessageBody: `Message at ${Date()}`,
    QueueUrl: process.env.SQS_URL,
  };

  // Send to SQS
  sqs
    .sendMessage(params)
    .promise()
    .then((result) => {
      console.log(result);
      return res.status(200).json({ success: true, message: result });
    })
    .catch((err) => {
      console.log(err);
      return res.status(200).json({ success: false, message: err });
    });
});

exports.consume = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "SQS event processed.",
      input: event,
    }),
  };
  console.info("event:", JSON.stringify(event));
  callback(null, response);
};

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

// app.listen(3000, () => {
//   console.log("app started");
// });

module.exports.handler = serverless(app);
