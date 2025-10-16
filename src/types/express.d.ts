// import { Document } from "mongoose";
import { IUser } from "../model/sample";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
