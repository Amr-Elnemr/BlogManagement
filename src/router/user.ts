import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import CustomError from "../helpers/CustomError";
import User, { validateUser } from "../model/user";
const router = express.Router();

//Sign-up
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name } = req.body;
  const result = await validateUser({ email, password, name });
  if (result.errors) {
    throw new CustomError("Invalid input!", 422, result.errors.details);
  }

  let createdUser = await User.findOne({ email: req.body.email });
  if (createdUser) {
    return res.status(400).send("User already exists!");
  }

  createdUser = new User({
    email,
    password,
    name,
  });

  createdUser
    .save()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(422);
      return next(err);
    });
});

//Login
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const result = await validateUser({ email, password }, true);
    if (result.errors) {
      throw new CustomError("Invalid input!", 422, result.errors.details);
    }
    const targetUser = await User.findOne({
      email: req.body.email,
    });
    const isMatch = await targetUser?.checkPassword(req.body.password);
    if (isMatch) {
      const token = await targetUser?.generateToken();
      return res.json({
        targetUser,
        token,
        message: "Hello Again",
      });
    }

    const error = new CustomError("User not Found!,", 401);
    return next(error);
  }
);

export default router;
