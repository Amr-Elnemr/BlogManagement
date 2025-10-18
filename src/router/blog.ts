import express from "express";
import CustomError from "helpers/CustomError";
import Blog from "model/blog";
const router = express.Router();
import authentication from "middlewares/authentication";
import { validateBlog } from "model/blog";
import mongoose from "mongoose";

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
router.put("/:id", authentication, async (req, res, next) => {
  //Check _id validity
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(422).send("Invalid ID!");
  }

  //query
  const targetBlog = await Blog.findOne({
    _id: req.params.id,
  });

  //Check existance
  if (!targetBlog) {
    return res
      .status(404)
      .send(`Error: Blog with id: ${req.params.id} to change not found!`);
  }

  //Check authorization
  if (!(req.user?._id as mongoose.Types.ObjectId).equals(targetBlog.owner)) {
    return res.status(401).send("You are not authorized for this action!");
  }

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
      targetBlog.set(key, result[key]);
    }
  });

  const updatedBlog = await targetBlog.save();
  res.status(200).send(updatedBlog);
});

/*====================== Delete ============================*/
router.delete("/:id", authentication, async (req, res, next) => {
  //Check _id validity
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(422).send("Invalid Blog ID!");
  }
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

  //Check authorization
  if (!(req.user?._id as mongoose.Types.ObjectId).equals(targetBlog.owner)) {
    return res.status(401).send("You are not authorized for this action!");
  }
  const result = await Blog.deleteOne({ _id: req.params.id });

  res.send({ ...result, targetBlog });
});

export default router;
