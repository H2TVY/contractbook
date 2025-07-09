const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const apiLimiter = require("./middlewares/rate-limit.middleware");

const JSend = require("./jsend");
const contactsRouter = require("./routes/contacts.router");
const {
  resourceNotFound,
  handleError,
} = require("./controllers/errors.controller");
const swaggerDocument = require("../docs/openapiSpec.json");

const app = express();

// Apply rate limiting to all routes
app.use(apiLimiter);

// CORS configuration for production
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL || "https://your-frontend-name.onrender.com"
      : ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.json(JSend.success());
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/public", express.static("public"));

contactsRouter.setup(app);

app.use(resourceNotFound);
app.use(handleError);

module.exports = app;
