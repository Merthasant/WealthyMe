import { Response } from "express";

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const responseUtils = {
  success(
    res: Response,
    status: 200 | 201,
    message: string,
    data?: any,
    errors?: any,
    meta?: Meta,
  ) {
    return res.status(status).json({
      status,
      success: true,
      message,
      data: data ?? null,
      errors: errors ?? null,
      meta: meta ?? null,
    });
  },

  error(
    res: Response,
    status: 400 | 401 | 403 | 404 | 409 | 422 | 500,
    message: string,
    data?: any,
    errors?: any,
    meta?: Meta,
  ) {
    return res.status(status).json({
      status,
      success: false,
      message,
      data: data ?? null,
      errors: errors ?? null,
      meta: meta ?? null,
    });
  },
};

export default responseUtils;
