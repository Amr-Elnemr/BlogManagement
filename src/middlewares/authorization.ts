import mongoose from "mongoose";
import { type Request, type Response, type NextFunction } from "express";
import CustomError from "../helpers/CustomError";

export default async (req: Request, res: Response, next: NextFunction) => {
  //Check authorization
  if (!(req.user?._id as mongoose.Types.ObjectId).equals(req.blog?.owner)) {
    throw new CustomError("You are not authorized for this action!", 401);
  }
  next();
};
