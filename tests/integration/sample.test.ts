import request from "supertest";
import { Server } from "http";
import User from "../../src/model/sample";
import mongoose from "mongoose";
let server: Server;

describe("/api/sample", () => {
  beforeAll(async () => {
    const { serverInstance } = await import("../../src/index");
    server = serverInstance;
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

  describe("GET", () => {
    it("should return all users", async () => {
      //your logic goes here
    });
  });

  describe("Get /:id", () => {
    it("should return user if valid id is passed", async () => {
      //your logic goes here
    });

    it("should return 404 if invalid id is passed", async () => {
      //your logic goes here
    });
  });

  describe("POST /", () => {
    //your logic goes here
  });
});
