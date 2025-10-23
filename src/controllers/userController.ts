import { type Request, type Response } from "express";
import defaultController from "./defaultController";
import createUser from "../services/user/createUser";
import loginUser from "../services/user/loginUser";

export const create = (req: Request, res: Response) => {
  const promise = createUser(req.body);
  return defaultController(res, promise);
};

export const login = (req: Request, res: Response) => {
  const promise = loginUser(req.body);
  return defaultController(res, promise);
};
