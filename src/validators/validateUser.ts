import CustomError from "../helpers/CustomError";
import Joi, { ValidationError } from "joi";
import { type Request, type Response, type NextFunction } from "express";

export function validateUser(skipName = false) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      throw new CustomError("Missing or Invalid Data!", 401);
    }
    let schema = Joi.object({
      email: Joi.string().min(5).max(255).required().email(),
      name: Joi.string().min(5).max(50).required(),
      password: Joi.string()
        .pattern(new RegExp(`^(?=.*[A-Za-z])(?=.*\\d).{8,}$`))
        .required(),
    });

    // make name optional for login endpoint
    if (skipName) {
      schema = schema.keys({
        name: Joi.optional(),
      });
    }
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      throw new CustomError(
        "Invalid input!",
        422,
        (error as ValidationError).details
      );
    }
  };
}
