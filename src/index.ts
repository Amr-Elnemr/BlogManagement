import { port } from "./config";
import express from "express";
import helmet from "helmet";
import "./db";
const app = express();
import error from "./middlewares/errorHandler";
import routes from "./routes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger";

app.use(express.static("public")); //for static server
app.use(express.json()); //for body parser to json
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// --- health check route ---
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//use routers
app.use("/v1/api", routes);

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

//Error handler middleware
app.use(error);

// Listening on port and message on start
export const serverInstance = app.listen(port, () => {
  console.log(`🚀 App listening on port ${port}`);
  console.log(`📗 Swagger docs available at http://localhost:${port}/api-docs`);
});
