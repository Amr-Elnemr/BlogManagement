// import { Document } from "mongoose";
import { IUserDocument } from "../model/user";
import { IBlogDocument } from "model/blog";

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
      blog?: IBlogDocument;
    }
  }
}
