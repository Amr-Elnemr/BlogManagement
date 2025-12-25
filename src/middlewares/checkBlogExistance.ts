import { type Request, type Response, type NextFunction } from "express";
import Blog from "../model/blog.model";
import CustomError from "../helpers/CustomError";

export default async (req: Request, res: Response, next: NextFunction) => {
  //query
  const targetBlog = await Blog.findOne({
    _id: req.params.id,
  });

  //Check existance
  if (!targetBlog) {
    throw new CustomError(
      `Error: Blog with id: ${req.params.id} not found!`,
      404
    );
  }
  req.blog = targetBlog;
  next();
};
