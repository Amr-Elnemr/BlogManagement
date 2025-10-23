import type CustomError from "../helpers/CustomError.js";
import { type Request, type Response, type NextFunction } from "express";

export default (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const resObj: { message: string; error?: string[] } = {
    message: err.message ? err.message : "something went wrong!",
  };
  if (err.errors) {
    resObj.error = err.errors;
  }
  // console.error(err.message, err);
  res.status(err.statusCode || 500).send(resObj);
};
