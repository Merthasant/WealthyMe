import z from "zod";
import { catchAllErrors } from "@/lib/utils/error.utils";
import { NextFunction, Request, Response } from "express";
import responseUtils from "@/lib/utils/response.utils";

const validationMiddleware = {
  validate(schema: z.ZodSchema) {
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
        next();
      } catch (err) {
        return catchAllErrors(res, err);
      }
    };
  },
};

export default validationMiddleware;
