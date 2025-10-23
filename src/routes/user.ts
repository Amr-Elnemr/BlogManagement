import express from "express";

const routes = express.Router();
import * as UserController from "../controllers/userController";
import { validateUser } from "../validators/validateUser";

//Register
routes.route("/").post([validateUser(), UserController.create]);

//Login
routes.route("/login").post([validateUser(true), UserController.login]);

export default routes;
