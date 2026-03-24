import { Request } from "express";
import { OptionParam } from "@/lib/types/params.type";
import { ValidationError } from "./error.utils";

const requestUtils = {
  getOptionQuerry(req: Request): OptionParam {
    const page: number = Number(req.query.page) ?? 1;
    const limit: number = Number(req.query.limit) ?? 1;
    const search: string = req.query.search?.toString() ?? "";
    const sortBy: string = req.query.sortBy?.toString() ?? "updatedAt";
    const getSortOrder = (): "asc" | "desc" => {
      if (req.query.sortOrder?.toString() === "asc") return "asc";
      if (req.query.sortOrder?.toString() === "desc") return "desc";
      throw new ValidationError("sortOrder must be asc or desc");
    };
    const sortOrder: "asc" | "desc" = getSortOrder();
    return { page, limit, search, sortBy, sortOrder };
  },
};

export default requestUtils;
