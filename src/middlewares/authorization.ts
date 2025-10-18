import mongoose from "mongoose";
import { type Request, type Response, type NextFunction } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
  //Check authorization
  if (!(req.user?._id as mongoose.Types.ObjectId).equals(req.blog?.owner)) {
    return res.status(401).send("You are not authorized for this action!");
  }
  next();
};
