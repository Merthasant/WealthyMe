import { catchAllErrors } from "@/lib/utils/error.utils";
import responseUtils from "@/lib/utils/response.utils";
import { Request, Response } from "express";
import categoryService from "./category.service";
import requestUtils from "@/lib/utils/request.utils";
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "@/lib/types/category.type";

const categoryController = {
  // get one category
  async getOneCategory(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) return responseUtils.error(res, 400, "category id is required!");
    const userId = req.userId;
    if (!userId)
      return responseUtils.error(
        res,
        400,
        "user id is required!,unauthorized!",
      );
    try {
      const categoryData = await categoryService.findById(
        id.toString(),
        userId,
      );
      return responseUtils.success(
        res,
        200,
        "category founded successfully!",
        categoryData,
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // get all category
  async getAllCategory(req: Request, res: Response) {
    const userId = req.userId;
    if (!userId)
      return responseUtils.error(
        res,
        400,
        "user id is required!,unauthorized!",
      );
    const CategoryParam = requestUtils.getCategoryOptionQuery(req);
    try {
      const categoryData = await categoryService.findByUserId(
        CategoryParam,
        userId,
      );
      return responseUtils.success(
        res,
        200,
        "category founded successfully!",
        categoryData.data,
        null,
        { ...categoryData.meta },
      );
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // create category
  async createCategory(req: Request, res: Response) {
    const { name, type }: CreateCategoryDTO = req.body;
    if (!name || !type)
      return responseUtils.error(res, 400, "all data is required!");
    const userId = req.userId;
    if (!userId)
      return responseUtils.error(
        res,
        400,
        "user id is required!,unauthorized!",
      );
    try {
      await categoryService.create({ name, type }, userId);
      return responseUtils.success(res, 201, "category created successfully");
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // update category
  async updateCategory(req: Request, res: Response) {
    const { name, type }: UpdateCategoryDTO = req.body;
    if (!name && !type)
      return responseUtils.error(res, 400, "one data must be required!");
    const id = req.params.id;
    if (!id) return responseUtils.error(res, 400, "category id is required!");
    const userId = req.userId;
    if (!userId)
      return responseUtils.error(
        res,
        400,
        "user id is required!,unauthorized!",
      );
    try {
      await categoryService.updateById({ name, type }, id.toString(), userId);
      return responseUtils.success(res, 200, "category updated successfuly");
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },

  // delete category
  async deleteCategory(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) return responseUtils.error(res, 400, "category id is required!");
    const userId = req.userId;
    if (!userId)
      return responseUtils.error(
        res,
        400,
        "user id is required!,unauthorized!",
      );
    try {
      await categoryService.deleteById(id.toString(), userId);
      return responseUtils.success(res, 200, "category deleted successfully");
    } catch (err) {
      return catchAllErrors(res, err);
    }
  },
};

export default categoryController;
