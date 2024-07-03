const logger = require('./logger');

function logAPICalls(req, res, next) {
  const { method, url, query, body } = req;
  const timestamp = new Date().toISOString();

  // Log request information
  logger.info(`${timestamp} - ${method} ${url} - Query: ${JSON.stringify(query)} - Body: ${JSON.stringify(body)}`);

  // Continue with the next middleware or route handler
  // Log response information
  const oldSend = res.send;
  res.send = function (data) {
    // Log response information
    logger.info(`${timestamp} - Response: ${JSON.stringify(data)}`);
    oldSend.apply(res, arguments);
  };
  next();
}

module.exports = logAPICalls;