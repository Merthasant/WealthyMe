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
      const dto = await userService.findByIdExcPass(id);
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
    const option = requestUtils.getOptionQuery(req);
    try {
      const dto = await userService.findAll(option);
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
    const { name, email, password, confPassword, role }: CreateUserDTO =
      req.body;
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
      return responseUtils.success(res, 201, "user created successfully", dto);
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
      const dto = await userService.updateById(id, {
        name,
        email,
        password,
        confPassword,
        role,
      });
      return responseUtils.success(res, 200, "user updated successfully", dto);
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // delete user
  async deleteUser(req: Request, res: Response) {
    const id = `${req.params.id}`;
    if (!id) return responseUtils.error(res, 400, "id is required!");
    try {
      const dto = await userService.deleteById(id);
      return responseUtils.success(res, 200, "user deleted successfuly", dto);
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },
};

export default userController;
