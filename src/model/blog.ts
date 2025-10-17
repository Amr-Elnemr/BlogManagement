import Joi from "joi";
import { Model, Schema, model, Types } from "mongoose";

export interface IBlog {
  title: string;
  content: string;
  category: string;
  owner?: Types.ObjectId;
}
interface IBlogMethods {
  //   checkPassword(plainPassword: string): Promise<boolean>;
  //   generateToken(): Promise<string | undefined>;
}

export type IBlogDocument = IBlog & IBlogMethods & Document;

interface IBlogStaticMethods extends Model<IBlogDocument> {
  //   getUserFromToken(token: string): Promise<IUser>;
}

export const BlogSchema = new Schema<
  IBlogDocument,
  IBlogStaticMethods,
  IBlogMethods
>(
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
export async function validateBlog(blog: IBlog) {
  let schema = Joi.object({
    title: Joi.string().min(20).max(255).required(),
    content: Joi.string().min(20).max(255).required(),
    category: Joi.string().min(3).max(20).optional(),
  });

  try {
    const result = await schema.validateAsync(blog);
    return result;
  } catch (error) {
    return { errors: error };
  }
}

// UserSchema.statics.getUserFromToken = async function getUserFromToken(token) {
//   const User = this;
//   const decoded = await verifyJWT(token, jwtSecret).catch((err) => {
//     // throw new CustomError(err.message, 401);
//     return null;
//   });
//   return User.findById(decoded?.id);
// };

// UserSchema.methods.checkPassword = async function (plainPassword: string) {
//   const currentDocument = this;
//   return bcrypt.compare(plainPassword, currentDocument.password);
// };

// UserSchema.methods.generateToken = async function () {
//   const currentDocument = this;
//   return signJWT({ id: currentDocument.id }, jwtSecret, { expiresIn: "1hr" });
// };

const Blog = model<IBlogDocument, IBlogStaticMethods>("Blog", BlogSchema);

export default Blog;
