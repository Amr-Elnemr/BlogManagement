import request from "supertest";
import { Server } from "http";
import User from "../../src/model/user.model";
import mongoose from "mongoose";
let server: Server;

let tempUser = {};
const baseURL = "/v1/api/users";
describe("/api/sample", () => {
  beforeAll(async () => {
    const { serverInstance } = await import("../../src/index");
    server = serverInstance;
    tempUser = {
      email: "user1@user1.com",
      password: "user1234",
      name: "user1",
    };
  });

  afterAll(async () => {
    server.close();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });
  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("Register || POST", () => {
    it("should return 422 if an invalid input is sent", async () => {
      const res = await request(server)
        .post(baseURL)
        .send({ ...tempUser, password: "user1" });

      const userToFind = await User.find({ username: "user1" });

      expect(res.status).toBe(422);
      expect(userToFind).toHaveLength(0);
    });

    it("should return 400 if the user to register already exists", async () => {
      const user = new User(tempUser);
      await user.save();

      const res = await request(server).post(baseURL).send(tempUser);

      expect(res.status).toBe(400);
    });

    it("should return 200 and register the user if valid input is sent", async () => {
      const res = await request(server).post(baseURL).send(tempUser);

      const userToCheck = await User.find({ username: "user1" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("email", "user1@user1.com");
      expect(userToCheck).not.toBeNull();
    });
  });

  describe("Login || POST", () => {
    it("should return 422 if an invalid input is sent", async () => {
      const user = new User(tempUser);
      await user.save();

      const res = await request(server)
        .post(`${baseURL}/login`)
        .send({ email: "user1@", password: "user1234" });

      expect(res.status).toBe(422);
    });

    it("should return 401 if the user not found", async () => {
      const res = await request(server)
        .post(`${baseURL}/login`)
        .send({ email: "user1@user1.com", password: "user1234" });

      expect(res.status).toBe(401);
    });

    it("should return 200 if a valid login credentials passed", async () => {
      const user = new User(tempUser);
      await user.save();

      const res = await request(server)
        .post(`${baseURL}/login`)
        .send({ email: "user1@user1.com", password: "user1234" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
    });
  });
});
