import z from "zod";
import { catchAllErrors } from "@/lib/utils/error.utils";
import { NextFunction, Request, Response } from "express";
import responseUtils from "@/lib/utils/response.utils";
import { createLogger } from "@/lib/utils/log.utils";

declare global {
  namespace Express {
    interface Request {
      validatedBody?: unknown;
      validatedQuery?: unknown;
    }
  }
}

const log = createLogger({ service: "validation-middleware" });

const validationMiddleware = {
  validateBody(schema: z.ZodSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        req.log.info({ body: req.body }, "Validating request body");
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
        log.info({ validatedBody: req.validatedBody }, "Request body is valid");
        next();
      } catch (err) {
        return catchAllErrors(res, err);
      }
    };
  },
  validateQuery(schema: z.ZodSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        req.log.info({ query: req.query }, "Validating request query");
        const result = await schema.safeParseAsync(req.query);
        if (!result.success) {
          return responseUtils.error(
            res,
            400,
            "validation error",
            z.treeifyError(result.error).errors,
          );
        }
        req.validatedQuery = result.data;
        log.info(
          { validatedQuery: req.validatedQuery },
          "Request query is valid",
        );
        next();
      } catch (err) {
        return catchAllErrors(res, err);
      }
    };
  },
};

export default validationMiddleware;
