import { Request, Response, NextFunction } from "express";
import errorHandler from "../../src/middlewares/errorHandler";
import CustomError from "../../src/helpers/CustomError";

describe("Error Handler Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  test("should send default 500 status and generic message when error is empty", () => {
    const err = {} as CustomError;

    errorHandler(
      err,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: "something went wrong!",
    });
  });
});
