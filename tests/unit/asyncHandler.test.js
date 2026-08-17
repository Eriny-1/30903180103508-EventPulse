const asyncHandler = require("../../utils/asyncHandler");

describe("asyncHandler", () => {
  test("should call the wrapped controller with req, res, and next", async () => {
    const controller = jest.fn(async (req, res, next) => {
      res.testValue = "called";
    });

    const wrapped = asyncHandler(controller);

    const req = {};
    const res = {};
    const next = jest.fn();

    await wrapped(req, res, next);

    expect(controller).toHaveBeenCalledWith(req, res, next);
    expect(res.testValue).toBe("called");
  });

  test("should pass rejected errors to next", async () => {
    const error = new Error("Test error");

    const controller = jest.fn(async () => {
      throw error;
    });

    const wrapped = asyncHandler(controller);

    const req = {};
    const res = {};
    const next = jest.fn();

    await wrapped(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
