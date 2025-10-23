import CustomError from "../../helpers/CustomError";
import User, { IUser } from "../../model/user";

export default async (data: IUser) => {
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
