import { type Response } from "express";

export default async <T>(
  res: Response,
  promise: Promise<T>,
  successCode = 200,
) => {
  const data = await promise;
  if (data) return res.status(successCode).json(data);
  return res.status(204).send(); //the return here is not needed but it is good for readability and to avoid any potential issues with further code execution after sending the response
};
