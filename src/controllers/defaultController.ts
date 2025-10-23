import { type Response } from "express";

export default async (res: Response, promise: Promise<any>) => {
  const data = await promise;
  if (data) return res.status(200).json(data);
  return res.status(204).send();
};
