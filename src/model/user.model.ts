import { Model, Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";
import { verifyJWT, signJWT } from "../helpers/jwtHelpers";
import { jwtSecret, saltRounds } from "../config";
import CustomError from "../helpers/CustomError";

export interface IUser {
  email: string;
  password: string;
  name: string;
}
interface IUserMethods {
  checkPassword(plainPassword: string): Promise<boolean>;
  generateToken(): Promise<string | undefined>;
}

export type IUserDocument = IUser & IUserMethods & Document;

interface IUserStaticMethods extends Model<IUserDocument> {
  getUserFromToken(token: string): Promise<IUserDocument>;
}

export const UserSchema = new Schema<
  IUserDocument,
  IUserStaticMethods,
  IUserMethods
>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        const { __v, password, ...rest } = ret;
        return rest;
      },
    },
  }
);

UserSchema.statics.getUserFromToken = async function getUserFromToken(token) {
  const User = this;
  const decoded = await verifyJWT(token, jwtSecret).catch((err) => {
    throw new CustomError(err, 401);
  });
  return User.findById(decoded?.id);
};

UserSchema.methods.checkPassword = async function (plainPassword: string) {
  const currentDocument = this;
  return bcrypt.compare(plainPassword, currentDocument.password);
};

UserSchema.methods.generateToken = function () {
  const currentDocument = this;
  return signJWT({ id: currentDocument.id }, jwtSecret, { expiresIn: "1h" });
};

//ensure hashed password before saving
UserSchema.pre("save", async function () {
  const currentDocument = this;
  if (currentDocument.isModified("password")) {
    currentDocument.password = await bcrypt.hash(
      currentDocument.password,
      saltRounds
    );
  }
});

const User = model<IUserDocument, IUserStaticMethods>("User", UserSchema);

export default User;
