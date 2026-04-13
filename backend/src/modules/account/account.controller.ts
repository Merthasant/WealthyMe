import { catchAllErrors } from "@/lib/utils/error.utils";
import responseUtils from "@/lib/utils/response.utils";
import { Request, Response } from "express";
import accountService from "./account.service";
import requestUtils from "@/lib/utils/request.utils";
import { CreateAccountDTO, UpdateAccountDTO } from "@/lib/types/account.type";

const accountController = {
  // get one account
  async getOneAccount(req: Request, res: Response) {
    const id = req.params.id;
    const userId = req.userId;
    if (!userId) return responseUtils.error(res, 400, "user id is required!");
    if (!id) return responseUtils.error(res, 400, "id is required!");
    try {
      const dto = await accountService.findById(id.toString(), userId);
      return responseUtils.success(
        res,
        200,
        "account founded successfully!",
        dto,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // get all account
  async getAllAccount(req: Request, res: Response) {
    const userId = req.userId;
    if (!userId) return responseUtils.error(res, 400, "user id is required!");
    const OptionParam = requestUtils.getAccountOptionQuery(req);
    try {
      const dto = await accountService.findAll(OptionParam, userId);
      return responseUtils.success(
        res,
        200,
        "all account found successfully",
        dto.data,
        null,
        dto.meta,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // create account
  async createAccount(req: Request, res: Response) {
    const {
      name,
      type,
      currency_code,
      balance = 0,
    }: CreateAccountDTO = req.body;
    if (!name || !type || !currency_code)
      return responseUtils.error(
        res,
        400,
        "name, account type and currency code is required!",
      );
    const userId = req.userId;
    if (!userId) return responseUtils.error(res, 400, "user id is required!");
    try {
      const dto = await accountService.create(
        { name, type, balance, currency_code },
        userId,
      );
      return responseUtils.success(
        res,
        201,
        "account created successfully!",
        dto,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // update account
  async updateAccount(req: Request, res: Response) {
    const { name, type, balance, currency_code }: UpdateAccountDTO = req.body;
    if (!name && !type && !balance && !currency_code)
      return responseUtils.error(res, 400, "one data must be required!");
    const id = req.params.id;
    const userId = req.userId;
    if (!userId) return responseUtils.error(res, 400, "user id is required!");
    if (!id) return responseUtils.error(res, 400, "id is required!");
    try {
      const dto = await accountService.updateById(
        { name, type, balance, currency_code },
        userId,
        id.toString(),
      );
      return responseUtils.success(
        res,
        200,
        "account updated successfully!",
        dto,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // delete account
  async deleteAccount(req: Request, res: Response) {
    const id = req.params.id;
    const userId = req.userId;
    if (!userId) return responseUtils.error(res, 400, "user id is required!");
    if (!id) return responseUtils.error(res, 400, "id is required!");
    try {
      const dto = await accountService.deleteById(userId, id.toString());
      return responseUtils.success(
        res,
        200,
        "account deleted successfully!",
        dto,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },
};

export default accountController;
