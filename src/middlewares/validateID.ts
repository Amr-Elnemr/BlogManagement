import mongoose from "mongoose";
import { type Request, type Response, type NextFunction } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
  //Check _id validity
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(422).send("Invalid Blog ID!");
  }
  next();
};
