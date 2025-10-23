import Blog from "../../model/blog";

export default async (
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
