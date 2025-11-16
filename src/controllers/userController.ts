import { type Request, type Response } from "express";
import defaultController from "./defaultController";
import { createUser, loginUser } from "../services/users.service";

export const create = (req: Request, res: Response) => {
  const promise = createUser(req.body);
  return defaultController(res, promise);
};

export const login = (req: Request, res: Response) => {
  const promise = loginUser(req.body);
  return defaultController(res, promise);
};
