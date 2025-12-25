import mongoose from "mongoose";
import { type Request, type Response, type NextFunction } from "express";
import CustomError from "../helpers/CustomError";

export default async (req: Request, res: Response, next: NextFunction) => {
  //Check _id validity
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new CustomError("Invalid Blog ID!", 422);
  }
  next();
};
