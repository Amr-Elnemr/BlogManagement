import { Response } from "express";
import defaultController from "../../src/controllers/defaultController";
import { signJWT } from "../../src/helpers/jwtHelpers";
import CustomError from "../../src/helpers/CustomError";

describe("defaultController", () => {
  let mockRes: Partial<Response>;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    // Create fresh mocks for each test
    sendMock = jest.fn().mockReturnThis();
    statusMock = jest.fn().mockReturnValue({
      send: sendMock,
    });

    mockRes = {
      status: statusMock,
    } as Partial<Response>;
  });

  it("should return 204 for null", async () => {
    const promise = Promise.resolve(null);
    await defaultController(mockRes as Response, promise);
    expect(statusMock).toHaveBeenCalledWith(204);
    expect(sendMock).toHaveBeenCalled();
  });

  it("should return 204 for undefined", async () => {
    const promise = Promise.resolve(undefined);
    await defaultController(mockRes as Response, promise);
    expect(statusMock).toHaveBeenCalledWith(204);
    expect(sendMock).toHaveBeenCalled();
  });
});

describe("signJWT", () => {
  it("should reject creation if invalid secret provided", async () => {
    await expect(
      signJWT({ userId: "123" }, "", { expiresIn: "1h" })
    ).rejects.toThrow("secretOrPrivateKey");
  });
});

describe("Custom Error", () => {
  it("should return an error with status code 500 if no error code passed", () => {
    const CustomErr = new CustomError("error message");
    expect(CustomErr.statusCode).toBe(500);
  });
});
