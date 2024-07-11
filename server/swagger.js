// server/swagger.js

const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Twilight Thoughts API 🍂 ",
      version: "1.0.0",
      description: "Stellar Notes API: Capture Your Thoughts, Secure Your Data, Your Notes Authenticated and Protected. 🎧 ",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: "http://localhost:5000/api/v1",
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the API routes folder
};

const specs = swaggerJsdoc(options);
module.exports = specs;
