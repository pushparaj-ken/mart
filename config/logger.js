// customLogger.js
const winston = require('winston');
const { createLogger, format } = winston;
//const { combine, timestamp, json } = format;
const fs = require('fs');
const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');
const AWS = require('aws-sdk');

const logDirectory = path.join(__dirname, 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

AWS.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION,
});

const cloudWatchLogs = new AWS.CloudWatchLogs();

const logGroupName = 'logs';
const logStreamName = 'PaizattoUatAdmin';

const logger1 = createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => {
      return `${info.timestamp} [${info.level}]: ${info.message}\n${info.stack || ''}`;
    })
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join(logDirectory, 'api-%DATE%.log'),
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: "100m", // 100 MB (example size)
      maxFiles: 1000, /// For example, keep up to 10 rotated files
    }),
    new winston.transports.Console(),
  ],
});

logger1.logBeforeData = function (message, beforeData) {
  const logMessage = `${message}\nBefore Data: ${JSON.stringify(beforeData, null, 2)}`;
  this.info(logMessage);
  sendLogToCloudWatch(logMessage);
};

logger1.logAfterData = function (message, afterData) {
  const logMessage = `${message}\nAfter Data: ${JSON.stringify(afterData, null, 2)}`;
  this.info(logMessage);
  sendLogToCloudWatch(logMessage);
};

logger1.errorWithLineNumber = function (message, error) {
  if (error && error.stack) {
    error.stack = `${message}\n${error.stack}`;
  } else {
    error = new Error(message);
  }
  this.error(error);
};

// Overriding the console.log function to log to both console and file
console.log = function (...args) {
  const message = args.map(arg => {
    if (typeof arg === 'object') {
      return JSON.stringify(arg);
    }
    return arg;
  }).join(' ');

  logger1.info(message);
};

function sendLogToCloudWatch(message) {

  const params = {
    logGroupName,
    logStreamName,
    logEvents: [
      {
        message,
        timestamp: new Date().getTime(),
      },
    ],
  };

  cloudWatchLogs.putLogEvents(params, function (err, data) {
    if (err) {
      console.error('Error putting log events to CloudWatch Logs:', err);
    } else {
      // console.log('Log events successfully sent to CloudWatch Logs:', data);
    }
  });
}

module.exports = logger1;