import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import CustomError from "helpers/CustomError";
import Blog from "model/blog";
const router = express.Router();
import authentication from "middlewares/authentication";
import { validateBlog } from "model/blog";
import mongoose from "mongoose";
import validateID from "middlewares/validateID";
import checkBlogExistance from "middlewares/checkBlogExistance";
import authorization from "middlewares/authorization";

/*===================== Get blogs (+ Paginated) =======================*/
router.get(["/:category", "/"], async (req, res, next) => {
  //Handle path param (category)
  const categoryQuery = req.params.category
    ? { category: req.params.category }
    : {};

  //Handle pagination query params
  const pageNumber = parseInt(req.query.page as string);
  const pageSize = parseInt(req.query.limit as string);

  //Search by title or content
  const regExprN = new RegExp(`${req.query.search}`, "i");
  const searchQuery = req.query.search
    ? [{ title: regExprN }, { content: regExprN }]
    : [];

  let blogs = await Blog.find(categoryQuery)
    .or(searchQuery)
    .populate("owner")
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .exec();

  return res.send(blogs);
});

/*====================== Create blog ============================*/
router.post("/", authentication, async (req, res, next) => {
  const { title, content, category } = req.body;
  const result = await validateBlog({ title, content, category });
  if (result.errors) {
    throw new CustomError("Invalid input!", 422, result.errors.details);
  }

  let existingBlog = await Blog.findOne({ title: req.body.title });
  if (existingBlog) {
    return res.status(400).send("Blog with same title already exists!");
  }
  const newBlog = new Blog({
    title,
    content,
    category,
    owner: req.user?._id,
  });

  newBlog
    .save()
    .then(async (blog) => {
      const populatedBlog = await blog.populate("owner");
      res.status(200).send(populatedBlog);
    })
    .catch((err) => {
      res.status(422);
      return next(err);
    });
});

/*====================== Update ============================*/
router.put(
  "/:id",
  [authentication, validateID, checkBlogExistance, authorization],
  async (req: Request, res: Response, next: NextFunction) => {
    //Check Inputs
    const { title, content, category } = req.body;
    const result = await validateBlog({ title, content, category }, true);
    if (result.errors) {
      throw new CustomError("Invalid input!", 422, result.errors.details);
    }

    //validate title uniqueness
    const existingBlog = await Blog.findOne({
      title: req.body.title,
    });
    if (existingBlog) {
      return res.status(400).send("Blog with same title already exists!");
    }

    //Update only provided values
    Object.keys(result).forEach((key) => {
      if (result[key]) {
        req.blog?.set(key, result[key]);
      }
    });

    const updatedBlog = await req.blog?.save();
    res.status(200).send(updatedBlog);
  }
);

/*====================== Delete ============================*/
router.delete(
  "/:id",
  [authentication, validateID, checkBlogExistance, authorization],
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await Blog.deleteOne({ _id: req.params.id });
    const targetBlog = req.blog;
    res.send({ ...result, targetBlog });
  }
);

export default router;
