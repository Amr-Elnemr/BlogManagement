import { Model, Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt, {
  type Secret,
  type SignOptions,
  type JwtPayload,
} from "jsonwebtoken";
import { jwtSecret, saltRounds } from "../config";

export interface IUser {
  username: string;
  age: number;
  password: string;
  isAdmin: boolean;
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
    username: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: Boolean,
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
    // throw new CustomError(err.message, 401);
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

// const signJWT = util.promisify(jwt.sign);
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
