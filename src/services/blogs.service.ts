import CustomError from "../helpers/CustomError";
import Blog, { IBlog, IBlogDocument } from "../model/blog.model";
import { Types } from "mongoose";

export const createBlog = async (Data: IBlog, UserID: Types.ObjectId) => {
  let existingBlog = await Blog.findOne({ title: Data.title });
  if (existingBlog) {
    throw new CustomError("Blog with same title already exists!", 400);
  }
  const newBlog = new Blog({
    title: Data.title,
    content: Data.content,
    category: Data.category,
    owner: UserID,
  });

  const createdBlog = await newBlog.save();
  return await createdBlog.populate("owner");
};

export const getBlog = async (
  category?: string,
  pageNumber = 0,
  pageSize = 0,
  searchKeyWord?: string
) => {
  //Handle path param (category)
  const categoryQuery = category
    ? { category: { $regex: new RegExp(`${category}`, "i") } }
    : {};

  //Search by title or content
  const regExprN = new RegExp(`${searchKeyWord}`, "i");
  const searchQuery = searchKeyWord
    ? [{ title: regExprN }, { content: regExprN }]
    : [];

  let blogs = await Blog.find(categoryQuery)
    .or(searchQuery)
    .populate("owner")
    .skip((pageNumber - 1) * pageNumber)
    .limit(pageSize)
    .exec();

  return blogs;
};

export const updateBlog = async (
  blogData: IBlog,
  blogDocument: IBlogDocument
) => {
  //validate title uniqueness
  const existingBlog = await Blog.findOne({
    title: blogData.title,
  });
  if (existingBlog) {
    throw new CustomError("Blog with same title already exists!", 400);
  }

  //Update only provided values
  for (const key in blogData) {
    blogDocument.set(key, blogData[key as keyof IBlog]);
  }

  const updatedBlog = await blogDocument.save();
  return updatedBlog;
};

export const deleteBlog = async (blogDocument: IBlogDocument) => {
  const result = await Blog.deleteOne({ _id: blogDocument._id });
  const targetBlog = blogDocument;
  return { ...result, targetBlog };
};
