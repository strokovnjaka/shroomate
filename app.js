/**
 * Load environment variables
 */
require("dotenv").config();

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");

/**
 * Swagger and OpenAPI
 */
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = swaggerJsDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Shroomate",
      version: "0.1.0",
      description: `Shroomate!
The world's wildest mushroom picker's tool **REST API**!!

The application supports:
* **browsing** mushroom sightings as they are reported in the wild,
* **species determination** by peers,
* and more.`,
    },
    tags: [
      {
        name: "Authentication",
        description: "User management and authentication.",
      },
      {
        name: "Determinations",
        description: "Determinations of mushroom sightings.",
      },
      {
        name: "Messages",
        description: "Messages between users of Shroomate.",
      },
      {
        name: "Sightings",
        description: "Sightings of mushrooms in the wild.",
      },
      {
        name: "Species",
        description: "Species of mushrooms.",
      },
      {
        name: "Users",
        description: "Users of Shroomate.",
      },
    ],
    servers: [
      {
        url: "https://localhost:3000/api",
        description: "Secure development server for testing",
      },
      {
        url: "http://localhost:3000/api",
        description: "Development server for testing",
      },
      {
        url: "https://shroomate.onrender.com/api",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          in: "header",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorMessage: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Message describing the error.",
            },
          },
          required: ["message"],
        },
      },
    },
  },
  apis: ["./api/models/*.js", "./api/controllers/*.js"],
});

/**
 * Create server
 */
const port = process.env.PORT || 3000;
const app = express();
app.use(cors());

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

/**
 *  Security issues resolved
 */
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.header('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

/**
 * Database connection
 */
const upload = require("./api/models/db.js");
require("./api/config/passport.js");

const apiRouter = require("./api/routes/api.js")(upload);

/**
 * Robots.txt
 */
app.get('/robots.txt', function (req, res) {
  res.type('text/plain');
  res.send("user-agent: *"); //\ndisallow: /api/");
  // res.send("User-agent: *\nDisallow: /");
});

/**
 * Static pages
 */
app.use(express.static(path.join(__dirname, "angular", "build")));

/**
 * Passport
 */
app.use(passport.initialize());

/**
 * Body parser (application/x-www-form-urlencoded)
 */
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * API routing
 */
app.use("/api", apiRouter);

/**
 * Angular routing
 */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "angular", "build", "index.html"));
});

/**
 * Swagger file and explorer
 */
apiRouter.get("/swagger.json", (req, res) =>
  res.status(200).json(swaggerDocument)
);
apiRouter.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, 
  //   {
  //   customCss: ".swagger-ui .topbar { display: none }",
  // }
  )
);

/**
 * Authorization error handler
 */
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError")
    res.status(401).json({ message: err.message });
});

/**
 * Start server
 */
if (process.env.HTTPS == "true") {
  const fs = require("fs");
  const https = require("https");
  https
    .createServer(
      {
        key: fs.readFileSync("cert/server.key"),
        cert: fs.readFileSync("cert/server.cert"),
      },
      app
    )
    .listen(port, () => {
      console.log(
        `Secure demo app started in '${process.env.NODE_ENV || "development"
        } mode' listening on port ${port}!`
      );
    });
} else {
  app.listen(port, () => {
    console.log(
      `Shroomate app started in ${
        process.env.NODE_ENV || "development"
      } mode listening on port ${port}!`
    );
  });
}
