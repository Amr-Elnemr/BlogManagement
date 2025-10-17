import type CustomError from "../helpers/CustomError.ts";
import { type Request, type Response, type NextFunction } from "express";

export default (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  const resObj: { message: string; error?: string[] } = {
    message: err.message ? err.message : "something went wrong!",
  };
  if (err.errors) {
    resObj.error = err.errors;
  }
  console.error(err.message, err);
  res.status(err.statusCode).send(resObj);
};
