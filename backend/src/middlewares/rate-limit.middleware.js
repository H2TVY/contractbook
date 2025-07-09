const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // Limit each IP to 20 requests per window
  message: {
    status: "error",
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true, // Include RateLimit headers in response
  legacyHeaders: false, // Disable X-RateLimit headers
});

module.exports = apiLimiter;
