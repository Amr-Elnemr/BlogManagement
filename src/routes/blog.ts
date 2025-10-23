import express from "express";

const routes = express.Router();
import * as BlogController from "../controllers/blogController";
import authentication from "../middlewares/authentication";
import authorization from "../middlewares/authorization";
import checkBlogExistance from "../middlewares/checkBlogExistance";
import validateID from "../middlewares/validateID";
import validateBlog from "../validators/validateBlog";

//Get Blogs
routes.route("/{:category}").get(BlogController.get);

//Create Blog
routes.route("/").post([validateBlog(), authentication, BlogController.create]);

//Update / Delete Blog
routes
  .route("/:id")
  .put([
    validateBlog(true),
    authentication,
    validateID,
    checkBlogExistance,
    authorization,
    BlogController.update,
  ])
  .delete([
    authentication,
    validateID,
    checkBlogExistance,
    authorization,
    BlogController.remove,
  ]);

export default routes;
