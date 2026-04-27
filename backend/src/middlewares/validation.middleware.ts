import z from "zod";
import { catchAllErrors } from "@/lib/utils/error.utils";
import { NextFunction, Request, Response } from "express";
import responseUtils from "@/lib/utils/response.utils";

declare global {
  namespace Express {
    interface Request {
      validatedBody?: unknown;
      validatedQuery?: unknown;
    }
  }
}

const validationMiddleware = {
  validateBody(schema: z.ZodSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await schema.safeParseAsync(req.body);
        if (!result.success) {
          return responseUtils.error(
            res,
            400,
            "validation error",
            null,
            z.treeifyError(result.error),
          );
        }
        req.validatedBody = result.data;
        next();
      } catch (err) {
        return catchAllErrors(res, err);
      }
    };
  },
  validateQuery(schema: z.ZodSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await schema.safeParseAsync(req.query);
        if (!result.success) {
          return responseUtils.error(
            res,
            400,
            "validation error",
            z.treeifyError(result.error),
          );
        }
        req.validatedQuery = result.data;
        next();
      } catch (err) {
        return catchAllErrors(res, err);
      }
    };
  },
};

export default validationMiddleware;
