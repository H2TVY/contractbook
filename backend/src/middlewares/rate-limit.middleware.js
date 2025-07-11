const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, 
  message: {
    status: "error",
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true, // Include RateLimit headers in response
  legacyHeaders: false, // Disable X-RateLimit headers
});

module.exports = apiLimiter;
