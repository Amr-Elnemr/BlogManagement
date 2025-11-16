import { Schema, model, Types, Document } from "mongoose";

export interface IBlog {
  title: string;
  content: string;
  category: string;
  owner?: Types.ObjectId;
}

export type IBlogDocument = IBlog & Document;

export const BlogSchema = new Schema<IBlogDocument>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      index: true,
    },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        const { __v, ...rest } = ret;
        return rest;
      },
    },
  }
);

const Blog = model<IBlogDocument>("Blog", BlogSchema);

export default Blog;
