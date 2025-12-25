import { type Request, type Response } from "express";
import defaultController from "./defaultController";
import { createUser, loginUser } from "../services/users.service";
import { IUserDocument } from "model/user.model";

export const create = (req: Request, res: Response) => {
  const promise = createUser(req.body);
  return defaultController(res, promise, 201);
};

export const login = (req: Request, res: Response) => {
  const promise = loginUser(req.body);
  return defaultController(res, promise);
};
