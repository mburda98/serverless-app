const serverless = require("serverless-http");
const express = require("express");
const app = express();

const AWSXRay = require("aws-xray-sdk-core");
const AWS = AWSXRay.captureAWS(require("aws-sdk"));

app.get("/", (req, res, next) => {
  if (Math.random() > 0.5) {
    return res.status(400).json({ message: "Bad request" });
  }

  return res.status(200).json({
    message: "Hello!",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
