import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "My Blog Management API",
      version: "1.0.0",
      description:
        "This is the backend service for a blog management system, built with **Express.js** and **TypeScript**. It provides a robust set of APIs to handle all aspects of blog content, including creating, reading, updating, and deleting posts, managing users, and handling authentication",
    },
    servers: [
      {
        url: "http://localhost:3000/v1/api",
        description: "dev server",
      },
    ],

    // Define security schemes if you use authentication
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
    },
  },
  // Path to files containing Swagger annotations
  apis: ["./src/docs/*.ts"], // Adjust path based on your project structure
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
