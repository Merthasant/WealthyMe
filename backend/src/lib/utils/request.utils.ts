import { Request } from "express";
import { AccountOptionParam, OptionParam } from "@/lib/types/params.type";
import { ValidationError } from "./error.utils";

function getBaseOption(req: Request): OptionParam {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search?.toString() ?? "";
  const sortBy = req.query.sortBy?.toString() ?? "updatedAt";

  const sortOrderRaw = req.query.sortOrder?.toString();
  if (sortOrderRaw !== "asc" && sortOrderRaw !== "desc") {
    throw new ValidationError("sortOrder must be asc or desc");
  }

  return { page, limit, search, sortBy, sortOrder: sortOrderRaw };
}

function extendOption<T extends Record<string, unknown>>(
  req: Request,
  extraParser: (req: Request) => T,
): OptionParam & T {
  const base = getBaseOption(req);
  const extra = extraParser(req);
  return { ...base, ...extra };
}

type AccountExtra = {
  type: "cash" | "e_wallet" | "bank" | "investment" | "all";
};

function parseAccountExtra(req: Request): AccountExtra {
  const type = req.query.type?.toString();
  if (
    type !== "cash" &&
    type !== "e_wallet" &&
    type !== "bank" &&
    type !== "investment" &&
    type !== "all"
  ) {
    throw new ValidationError(
      "type must be cash, e_wallet, bank, investment or all",
    );
  }
  return { type };
}

const requestUtils = {
  getOptionQuery(req: Request): OptionParam {
    return getBaseOption(req);
  },

  getAccountOptionQuery(req: Request): AccountOptionParam {
    return extendOption(req, parseAccountExtra);
  },
};

export default requestUtils;
