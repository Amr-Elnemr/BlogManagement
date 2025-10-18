import Joi from "joi";
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
export async function validateBlog(blog: IBlog, skipRequired = false) {
  let schema = Joi.object({
    title: Joi.string().min(20).max(255).required(),
    content: Joi.string().min(20).max(500).required(),
    category: Joi.string().min(3).max(20).optional(),
  });

  if (skipRequired) {
    schema = schema.keys({
      title: Joi.optional(),
      content: Joi.optional(),
    });
  }

  try {
    const result = await schema.validateAsync(blog);
    return result;
  } catch (error) {
    return { errors: error };
  }
}

const Blog = model<IBlogDocument>("Blog", BlogSchema);

export default Blog;
