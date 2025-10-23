import CustomError from "../../helpers/CustomError";
import Blog, { IBlog } from "../../model/blog";
import { Types } from "mongoose";

export default async (Data: IBlog, UserID: Types.ObjectId) => {
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
