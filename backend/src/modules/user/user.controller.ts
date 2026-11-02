import { catchAllErrors } from "@/lib/utils/error.utils.js";
import responseUtils from "@/lib/utils/response.utils.js";
import { Response, Request } from "express";
import userService from "./user.service.js";
import { CreateUserDTO, UpdateUserDTO } from "@/lib/types/user.type.js";
import { BaseOptionParams } from "@/lib/types/params.type.js";
import { createLogger } from "@/lib/utils/log.utils.js";

const log = createLogger({ service: "user-controller" });

const userController = {
  // get one user
  async getOneUser(req: Request, res: Response) {
    req.log.info({ params: req.params }, "Received request to get one user");
    const id = `${req.params.id}`;
    log.info({ userId: id }, "Fetching user data");
    if (!id) return responseUtils.error(res, 400, "id is required!");
    try {
      const dto = await userService.findByIdExcPass(id);
      log.info({ userData: dto }, "User data retrieved");
      return responseUtils.success(
        res,
        200,
        "successfully getting data user",
        dto,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },
  // get all user
  async getAllUser(req: Request, res: Response) {
    req.log.info(
      { query: req.validatedQuery },
      "Received request to get all users",
    );
    const option = req.validatedQuery as BaseOptionParams;
    log.info({ option }, "Fetching all user data");
    try {
      const dto = await userService.findAll(option);
      log.info({ userData: dto.data }, "All user data retrieved");
      return responseUtils.success(
        res,
        200,
        "successfully getting all user",
        dto.data,
        null,
        dto.meta,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },
  // create user
  async createUser(req: Request, res: Response) {
    req.log.info(
      { body: req.validatedBody },
      "Received request to create user",
    );
    const { name, email, password, confPassword, role } =
      req.validatedBody as CreateUserDTO;
    if (!name || !email || !password || !confPassword || !role)
      return responseUtils.error(res, 400, "all data is required!");
    try {
      const dto = await userService.create({
        name,
        email,
        password,
        confPassword,
        role,
      });
      log.info({ userData: dto }, "User created successfully");
      return responseUtils.success(res, 201, "user created successfully", dto);
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },
  // update user
  async updateUser(req: Request, res: Response) {
    req.log.info(
      { params: req.params, body: req.validatedBody },
      "Received request to update user",
    );
    const id = `${req.params.id}`;
    log.info({ userId: id }, "Fetching user data for update");
    if (!id) return responseUtils.error(res, 400, "id is required!");
    const { name, email, password, confPassword, role } =
      req.validatedBody as UpdateUserDTO;
    if (!name && !email && !password && !confPassword && !role)
      return responseUtils.error(res, 400, "one data must be required!");
    try {
      const dto = await userService.updateById(id, {
        name,
        email,
        password,
        confPassword,
        role,
      });
      log.info({ userData: dto }, "User updated successfully");
      return responseUtils.success(res, 200, "user updated successfully", dto);
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // delete user
  async deleteUser(req: Request, res: Response) {
    req.log.info({ params: req.params }, "Received request to delete user");
    const id = `${req.params.id}`;
    log.info({ userId: id }, "Fetching user data for deletion");
    if (!id) return responseUtils.error(res, 400, "id is required!");
    try {
      const dto = await userService.deleteById(id);
      log.info({ userData: dto }, "User deleted successfully");
      return responseUtils.success(res, 200, "user deleted successfully", dto);
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },
};

export default userController;
