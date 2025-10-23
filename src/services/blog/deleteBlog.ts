import Blog, { IBlogDocument } from "../../model/blog";

export default async (blogDocument: IBlogDocument) => {
  const result = await Blog.deleteOne({ _id: blogDocument._id });
  const targetBlog = blogDocument;
  return { ...result, targetBlog };
};
