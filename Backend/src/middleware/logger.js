const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${method} ${url} - ${ip}`);
  
  if (req.body && Object.keys(req.body).length > 0) {
    // Don't log sensitive data like passwords
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) {
      sanitizedBody.password = '[HIDDEN]';
    }
    console.log('Request Body:', sanitizedBody);
  }
  
  next();
};

module.exports = { logger }; 