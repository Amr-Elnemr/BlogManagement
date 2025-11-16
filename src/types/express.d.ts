// import { Document } from "mongoose";
import { IUserDocument } from "../model/user.model";
import { IBlogDocument } from "../model/blog.model";

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
      blog?: IBlogDocument;
    }
  }
}
