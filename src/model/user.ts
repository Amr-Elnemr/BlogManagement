import { Model, Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt, {
  type Secret,
  type SignOptions,
  type JwtPayload,
} from "jsonwebtoken";
import { jwtSecret, saltRounds } from "../config";
import Joi from "joi";
import { skip } from "node:test";

export interface IUser {
  email: string;
  password: string;
  name?: string;
}
interface IUserMethods {
  checkPassword(plainPassword: string): Promise<boolean>;
  generateToken(): Promise<string | undefined>;
}

export type IUserDocument = IUser & IUserMethods & Document;

interface IUserStaticMethods extends Model<IUserDocument> {
  getUserFromToken(token: string): Promise<IUser>;
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

export async function validateUser(user: IUser, skipName = false) {
  let schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    name: Joi.string().min(5).max(50).required(),
    password: Joi.string()
      .pattern(new RegExp(`^(?=.*[A-Za-z])(?=.*\\d).{8,}$`))
      .required(),
  });

  // make name optional for login endpoint
  if (skipName) {
    schema = schema.keys({
      name: Joi.optional(),
    });
  }
  try {
    const result = await schema.validateAsync(user);
    return result;
  } catch (error) {
    return { errors: error };
  }
}

UserSchema.statics.getUserFromToken = async function getUserFromToken(token) {
  const User = this;
  const decoded = await verifyJWT(token, jwtSecret).catch((err) => {
    return null;
  });
  return User.findById(decoded?.id);
};

UserSchema.methods.checkPassword = async function (plainPassword: string) {
  const currentDocument = this;
  return bcrypt.compare(plainPassword, currentDocument.password);
};

UserSchema.methods.generateToken = async function () {
  const currentDocument = this;
  return signJWT({ id: currentDocument.id }, jwtSecret, { expiresIn: "1hr" });
};

const signJWT = (
  payload: string | object | Buffer,
  secretOrPrivateKey: Secret,
  options: SignOptions
): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secretOrPrivateKey, options, (err, token) => {
      if (err) {
        return reject(err);
      }
      resolve(token);
    });
  });
};

const verifyJWT = (
  token: string,
  secretOrPublicKey: Secret
): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded as JwtPayload);
    });
  });
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
