import { catchAllErrors } from "@/lib/utils/error.utils.js";
import responseUtils from "@/lib/utils/response.utils.js";
import { Response, Request } from "express";
import userService from "./user.service.js";
import requestUtils from "@/lib/utils/request.utils.js";
import { CreateUserDTO, UpdateUserDTO } from "@/lib/types/user.type.js";

const userController = {
  // get one user
  async getOneUser(req: Request, res: Response) {
    const id = `${req.params.id}`;
    if (!id) return responseUtils.error(res, 400, "id is required!");
    try {
      const userData = await userService.findByIdExcPass(id);
      if (!userData) responseUtils.error(res, 404, "user not found!");
      return responseUtils.success(
        res,
        200,
        "successfully getting data user",
        userData,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },
  // get all user
  async getAllUser(req: Request, res: Response) {
    try {
      const option = requestUtils.getOptionQuerry(req);
      const userData = await userService.findAll(option);
      return responseUtils.success(
        res,
        200,
        "successfult getting all user",
        userData.data,
        null,
        userData.meta,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },
  // create user
  async createUser(req: Request, res: Response) {
    const { name, email, password, confPassword, role }: CreateUserDTO =
      req.body;
    if (!name || !email || !password || !confPassword || !role)
      return responseUtils.error(res, 400, "all data is required!");
    try {
      await userService.create({ name, email, password, confPassword, role });
      return responseUtils.success(res, 201, "user created successfully");
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },
  // update user
  async updateUser(req: Request, res: Response) {
    const id = `${req.params.id}`;
    if (!id) return responseUtils.error(res, 400, "id is required!");
    const { name, email, password, confPassword, role }: UpdateUserDTO =
      req.body;
    if (!name && !email && !password && !confPassword && !role)
      return responseUtils.error(res, 400, "one data must be required!");
    try {
      await userService.updateById(id, {
        name,
        email,
        password,
        confPassword,
        role,
      });
      return responseUtils.success(res, 200, "user updated successfully");
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // delete user
  async deleteUser(req: Request, res: Response) {
    const id = `${req.params.id}`;
    if (!id) return responseUtils.error(res, 400, "id is required!");
    try {
      await userService.deleteById(id);
      return responseUtils.success(res, 200, "user deleted successfuly");
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },
};

export default userController;
