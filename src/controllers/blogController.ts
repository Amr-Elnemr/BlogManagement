import { type Request, type Response } from "express";
import defaultController from "./defaultController";
import getBlog from "../services/blog/getBlog";
import createBlog from "../services/blog/createBlog";
import { Types } from "mongoose";
import updateBlog from "../services/blog/updateBlog";
import { IBlogDocument } from "../model/blog";
import deleteBlog from "../services/blog/deleteBlog";

export const get = (req: Request, res: Response) => {
  const pageNumber = parseInt(req.query.page as string);
  const pageSize = parseInt(req.query.limit as string);
  const promise = getBlog(
    req.params.category,
    pageNumber,
    pageSize,
    req.query.search as string
  );
  return defaultController(res, promise);
};

export const create = (req: Request, res: Response) => {
  const promise = createBlog(req.body, req.user?._id as Types.ObjectId);
  return defaultController(res, promise);
};

export const update = (req: Request, res: Response) => {
  const promise = updateBlog(req.body, req.blog as IBlogDocument);
  return defaultController(res, promise);
};

export const remove = (req: Request, res: Response) => {
  const promise = deleteBlog(req.blog as IBlogDocument);
  return defaultController(res, promise);
};
