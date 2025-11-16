import { Router } from "express";

import userRoutes from "./users.routes";
import blogRoutes from "./blogs.routes";

const routes = Router();

routes.use("/users", userRoutes);
routes.use("/blogs", blogRoutes);

export default routes;
