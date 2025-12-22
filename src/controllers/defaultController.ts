import { type Response } from "express";

export default async (
  res: Response,
  promise: Promise<any>,
  successCode = 200
) => {
  const data = await promise;
  if (data) return res.status(successCode).json(data);
  return res.status(204).send();
};
