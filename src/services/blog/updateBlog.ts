import CustomError from "../../helpers/CustomError";
import Blog, { IBlog, IBlogDocument } from "../../model/blog";

export default async (blogData: IBlog, blogDocument: IBlogDocument) => {
  //validate title uniqueness
  const existingBlog = await Blog.findOne({
    title: blogData.title,
  });
  if (existingBlog) {
    throw new CustomError("Blog with same title already exists!", 400);
  }

  //Update only provided values
  for (const key in blogData) {
    if (blogData[key as keyof IBlog]) {
      blogDocument.set(key, blogData[key as keyof IBlog]);
    }
  }

  const updatedBlog = await blogDocument.save();
  return updatedBlog;
};
