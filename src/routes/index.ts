import { Router } from "express";

import userRoutes from "./user";
import blogRoutes from "./blog";

const routes = Router();

routes.use("/users", userRoutes);
routes.use("/blogs", blogRoutes);

export default routes;
