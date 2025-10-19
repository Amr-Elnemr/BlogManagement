import { type Request, type Response, type NextFunction } from "express";
import Blog from "../model/blog";

export default async (req: Request, res: Response, next: NextFunction) => {
  //query
  const targetBlog = await Blog.findOne({
    _id: req.params.id,
  });

  //Check existance
  if (!targetBlog) {
    return res
      .status(404)
      .send(`Error: Blog with id: ${req.params.id} not found!`);
  }
  req.blog = targetBlog;
  next();
};
