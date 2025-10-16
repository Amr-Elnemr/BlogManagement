import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send("This is the user router");
});

export default router;
