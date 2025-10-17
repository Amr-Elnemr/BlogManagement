import { port } from "./config";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import helmet from "helmet";

import userRouter from "./router/user";
import blogRouter from "./router/blog";
import "./db";
const app = express();

import error from "./middlewares/error";

app.use(express.static("public")); //for static server
app.use(express.json()); //for body parser to json
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

//Middlewares
// middleware to just log req url
app.use(["/"], (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "HEAD") {
    return res.send("Not supported!");
  }
  console.log("req url is: " + req.baseUrl);
  next();
});

//use routers
app.use(["/user", "/users"], userRouter);
app.use(["/blog", "/blogs"], blogRouter);

//Error handler middleware
app.use(error);

// Listening on port and message on start
export const serverInstance = app.listen(port, () => {
  console.log(`🚀 App listening on port ${port}`);
});
