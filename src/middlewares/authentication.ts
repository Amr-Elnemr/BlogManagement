import CustomError from "../helpers/CustomError";
import User from "../model/sample";
import { type Request, type Response, type NextFunction } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new CustomError("Authorization required!", 401);
    }
    req.user = await User.getUserFromToken(authorization);
    if (!req.user) {
      throw new CustomError("Authorization required: user not found!", 401);
    }
    next();
  } catch (error) {
    next(error);
  }
};
