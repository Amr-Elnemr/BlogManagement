import User from "../../src/model/user";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { jwtSecret, saltRounds } from "../../src/config";
import bcrypt from "bcrypt";

describe("user.generateToken", () => {
  it("should return a valid JWT", async () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
    };
    const user = new User(payload);
    const token = await user.generateToken();
    const decoded = jwt.verify(token!, jwtSecret);
    expect(decoded).toHaveProperty("id", payload._id);
  });
});

describe("user.checkPassword", () => {
  it("should return a valid hashed password", async () => {
    const payload = {
      password: "user1234",
    };
    const user = new User(payload);
    const hashedPassword = await bcrypt.hash(payload.password, saltRounds);
    user.password = hashedPassword;

    const result = await user.checkPassword(payload.password);
    expect(result).toBe(true);
  });
});
