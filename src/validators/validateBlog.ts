import CustomError from "../helpers/CustomError";
import Joi, { ValidationError } from "joi";
import { type Request, type Response, type NextFunction } from "express";

export default function validateBlog(skipRequired = false) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      throw new CustomError("Missing or Invalid Data!", 401);
    }
    let schema = Joi.object({
      title: Joi.string().min(20).max(255).required(),
      content: Joi.string().min(20).max(500).required(),
      category: Joi.string().min(3).max(20).optional(),
    });

    if (skipRequired) {
      schema = schema.keys({
        title: Joi.optional(),
        content: Joi.optional(),
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
