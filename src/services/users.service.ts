import CustomError from "../helpers/CustomError";
import User, { IUser } from "../model/user.model";

export const createUser = async (data: IUser) => {
  let createdUser = await User.findOne({ email: data.email });
  if (createdUser) {
    throw new CustomError("User already exists!", 400);
  }

  createdUser = new User(data);

  return await createdUser.save();
};

export const loginUser = async (data: IUser) => {
  const targetUser = await User.findOne({
    email: data.email,
  });
  const isMatch = await targetUser?.checkPassword(data.password);
  if (isMatch) {
    const token = await targetUser?.generateToken();
    return {
      targetUser,
      token,
      message: "Hello Again",
    };
  }

  throw new CustomError("User not Found!,", 401);
};
