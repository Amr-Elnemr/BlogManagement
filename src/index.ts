import { port } from "./config";
import express from "express";
import helmet from "helmet";
import "./db";
const app = express();
import error from "./middlewares/errorHandler";
import routes from "./routes";

app.use(express.static("public")); //for static server
app.use(express.json()); //for body parser to json
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

//use routers
app.use("/v1/api", routes);

//Error handler middleware
app.use(error);

// Listening on port and message on start
export const serverInstance = app.listen(port, () => {
  console.log(`🚀 App listening on port ${port}`);
});
