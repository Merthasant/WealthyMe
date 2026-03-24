import { Response } from "express";
import responseUtils from "./response.utils";

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

export class InternalServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InternalServerError";
  }
}

export const catchAllErrors = (res: Response, err: any) => {
  console.error("Unhandled error:", err);

  if (err instanceof BadRequestError || err instanceof ValidationError) {
    return responseUtils.error(
      res,
      400,
      err.message || "Bad request",
      null,
      err,
    );
  }

  if (err instanceof UnauthorizedError) {
    return responseUtils.error(
      res,
      401,
      err.message || "Unauthorized",
      null,
      err,
    );
  }

  if (err instanceof ForbiddenError) {
    return responseUtils.error(res, 403, err.message || "Forbidden", null, err);
  }

  if (err instanceof NotFoundError) {
    return responseUtils.error(res, 404, err.message || "Not found", null, err);
  }

  if (err instanceof ConflictError) {
    return responseUtils.error(res, 409, err.message || "Conflict", null, err);
  }

  if (err instanceof InternalServerError) {
    return responseUtils.error(
      res,
      500,
      err.message || "Internal server error",
      null,
      err,
    );
  }

  // fallback for uncaught exceptions or unknown error types
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  const errors = err.errors || null;

  return responseUtils.error(res, status, message, null, errors);
};
