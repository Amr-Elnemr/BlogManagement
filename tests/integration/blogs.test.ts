import request from "supertest";
import { Server } from "http";
import mongoose, { Types } from "mongoose";
import Blog, { IBlog } from "../../src/model/blog.model";
import User, { IUser, IUserDocument } from "../../src/model/user.model";
let server: Server;

const tempUser: IUser = {
  email: "user1@user1.com",
  password: "user1234",
  name: "user1",
};
const tempPosts: IBlog[] = [
  {
    title: "This is our testing blog post title 1",
    content: "This is our testing blog post very very long content 1",
    category: "testing",
  },
  {
    title: "This is our testing blog post title 2",
    content: "This is our testing blog post very very long content 2",
    category: "testing",
  },
  {
    title: "This is our testing blog post title 3",
    content: "This is our testing blog post very very long content 3",
    category: "testing",
  },
];
let authToken: string;
let createdUser: IUserDocument;
const baseURL = "/v1/api/blogs";

async function createUser(user: IUser) {
  const createdUser = await User.create(tempUser);
  // Login to get token
  const loginResponse = await request(server).post("/v1/api/users/login").send({
    email: tempUser.email,
    password: tempUser.password,
  });

  authToken = `Bearer ${loginResponse.body.token}`;
  return { createdUser, authToken };
}

describe("Blogs Testing", () => {
  beforeAll(async () => {
    const { serverInstance } = await import("../../src/index");
    server = serverInstance;

    ({ createdUser, authToken } = await createUser(tempUser));
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});
    server.close();
    await mongoose.connection.close();
  });

  describe("Get all posts before any creation|| Get", () => {
    it("should return 200 with length 0 if no posts found", async () => {
      const res = await request(server).get(baseURL);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });

  describe("Get posts after creation|| Get", () => {
    beforeAll(async () => {
      await Blog.deleteMany({});
      const posts = Blog.create(
        tempPosts.map((post) => ({
          ...post,
          owner: createdUser._id as Types.ObjectId,
        }))
      );
      await Blog.populate(posts, { path: "owner" });
    });

    it("should return 200 with length 3 after creating 3 blog", async () => {
      const res = await request(server).get(baseURL);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
    });

    it("should return 200 with length 0 if filter applied for unknown category", async () => {
      const res = await request(server).get(`${baseURL}/unknown`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });

    it("should return 200 with length 2 if limit of 2 applied", async () => {
      const res = await request(server).get(`${baseURL}?limit=2`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it("should return 200 with length 1 if limit of 2 applied with 2nd page", async () => {
      const res = await request(server).get(`${baseURL}?page=2&limit=2`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it("should return 200 with length 1 search by word `2`", async () => {
      const res = await request(server).get(`${baseURL}?search=2`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });
  });

  describe("Manipulating Blog posts:", () => {
    afterAll(async () => {
      await Blog.deleteMany({});
    });

    describe("Creation", () => {
      it("shoudl return 401 if attempt to create post unauthorized", async () => {
        const res = await request(server).post(baseURL).send(tempPosts[0]);
        expect(res.status).toBe(401);
      });

      it("shoudl return 401 if attempt to create post with invalid token", async () => {
        const res = await request(server)
          .post(baseURL)
          .set("Authorization", "invalid token")
          .send(tempPosts[0]);
        expect(res.body.message).toContain("JsonWebTokenError");
        expect(res.status).toBe(401);
      });

      it("should return 201 if blog got created successfully", async () => {
        const res = await request(server)
          .post(baseURL)
          .set("Authorization", authToken)
          .send({
            ...tempPosts[0],
            title: "This is our testing blog post title 0",
          });
        expect(res.status).toBe(201);
      });

      it("should return 400 if blog with same title already created", async () => {
        const res = await request(server)
          .post(baseURL)
          .set("Authorization", authToken)
          .send(tempPosts[0]);
        expect(res.status).toBe(400);
      });
    });

    describe("Updating", () => {
      it("should return 401 if attempt to update the blog unauthorized", async () => {
        const postCreated = await Blog.findOne().exec();
        const res = await request(server)
          .put(`${baseURL}/${(postCreated?._id as Types.ObjectId).toString()}`)
          .send(tempPosts[0]);
        expect(res.status).toBe(401);
      });
      it("should return 400 if attempt to update the blog with the same title", async () => {
        const postCreated = await Blog.findOne().exec();
        const res = await request(server)
          .put(`${baseURL}/${(postCreated?._id as Types.ObjectId).toString()}`)
          .set("Authorization", authToken)
          .send(tempPosts[0]);
        expect(res.status).toBe(400);
      });
      it("should return 200 if update done successfully", async () => {
        const postCreated = await Blog.findOne().exec();
        const res = await request(server)
          .put(`${baseURL}/${(postCreated?._id as Types.ObjectId).toString()}`)
          .set("Authorization", authToken)
          .send({ content: "updated content" });
        expect(res.status).toBe(200);
        expect(res.body.content).toContain("updated");
      });
      it("should return 422 if invalide blog-id passed", async () => {
        const res = await request(server)
          .put(`${baseURL}/invalide Blog ID`)
          .set("Authorization", authToken)
          .send({ content: "updated content" });
        expect(res.status).toBe(422);
        expect(res.body.message).toContain("Invalid Blog ID!");
      });
    });

    describe("Deleting", () => {
      it("should return 401 if attempt to delete the blog unauthorized", async () => {
        const postCreated = await Blog.findOne().exec();
        const res = await request(server).delete(
          `${baseURL}/${(postCreated?._id as Types.ObjectId).toString()}`
        );
        expect(res.status).toBe(401);
      });

      it("should return 404 if attempt to delete the blog that is not found", async () => {
        const postCreated = await Blog.findOne().exec();
        const res = await request(server)
          .delete(`${baseURL}/68f2984f54b13b0e3624bc96`)
          .set("Authorization", authToken);
        expect(res.status).toBe(404);
      });

      it("should return 200 if removal done successfully", async () => {
        const postCreated = await Blog.findOne().exec();
        const res = await request(server)
          .delete(
            `${baseURL}/${(postCreated?._id as Types.ObjectId).toString()}`
          )
          .set("Authorization", authToken);
        expect(res.status).toBe(200);
      });

      it("should return 401 if the token provided to delete is for removed user", async () => {
        await User.deleteMany({});
        const postCreated = await Blog.findOne().exec();
        const res = await request(server)
          .delete(
            `${baseURL}/${(postCreated?._id as Types.ObjectId).toString()}`
          )
          .set("Authorization", authToken);
        expect(res.status).toBe(401);
        expect(res.body.message).toContain("user not found!");
      });

      it("should return 401 with authorization error if another user attempt to delete a blog he doesn't own", async () => {
        ({ authToken } = await createUser(tempUser));
        const postCreated = await Blog.findOne().exec();
        const res = await request(server)
          .delete(
            `${baseURL}/${(postCreated?._id as Types.ObjectId).toString()}`
          )
          .set("Authorization", authToken);
        expect(res.status).toBe(401);
        expect(res.body.message).toContain("You are not authorized");
      });
    });
  });
});
