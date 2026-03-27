import { catchAllErrors } from "@/lib/utils/error.utils";
import responseUtils from "@/lib/utils/response.utils";
import { Request, Response } from "express";

const authController = {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password)
      return responseUtils.error(res, 400, "email or password is required!");
    try {
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },
  async register(req: Request, res: Response) {
    const { name, email, password, confPassword, role } = req.body;
    if (!name || !email || !password || !confPassword || !role)
      return responseUtils.error(res, 400, "email or password is required!");
    try {
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },
};
