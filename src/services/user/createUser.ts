import CustomError from "../../helpers/CustomError";
import User, { IUser } from "../../model/user";

export default async (data: IUser) => {
  let createdUser = await User.findOne({ email: data.email });
  if (createdUser) {
    throw new CustomError("User already exists!", 400);
  }

  createdUser = new User(data);

  return await createdUser.save();
};
