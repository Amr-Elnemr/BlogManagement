import express, { type Request, type Response } from "express";
const router = express.Router();
import path from "path";

router.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

export default router;
