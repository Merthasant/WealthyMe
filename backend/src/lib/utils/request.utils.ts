import { Request } from "express";
import {
  AccountOptionParam,
  CategoryOptionParam,
  OptionParam,
  TransactionOptionParam,
} from "@/lib/types/params.type";
import { ValidationError } from "./error.utils";

function getBaseOption(req: Request): OptionParam {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search?.toString() ?? "";
  const sortBy = req.query.sortBy?.toString() ?? "updatedAt";

  const sortOrderRaw = req.query.sortOrder?.toString();
  let sortOrder: "asc" | "desc" | undefined = undefined;
  if (sortOrderRaw !== "asc" && sortOrderRaw !== "desc") {
    sortOrder = "asc";
  } else {
    sortOrder = sortOrderRaw;
  }

  return { page, limit, search, sortBy, sortOrder };
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

const parseAccountExtra = (req: Request): AccountExtra => {
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
};

type CategoryExtra = {
  type: "income" | "expense" | "all";
};

const parseCategoryExtra = (req: Request): CategoryExtra => {
  const type = req.query.type?.toString();
  if (type !== "income" && type !== "expense" && type !== "all") {
    return { type: "all" };
  }
  return { type };
};

type TransactionExtra = {
  type?: "income" | "expense" | "all";
  from_date?: number;
  to_date?: number;
};

const parseTransactionExtra = (req: Request): TransactionExtra => {
  const type = req.query.type?.toString();
  const from_date_raw = Number(req.query.from_date) ?? undefined;
  const to_date_raw = Number(req.query.to_date) ?? undefined;

  const from_date = from_date_raw !== 0 ? from_date_raw : undefined;
  const to_date = to_date_raw !== 0 ? from_date_raw : undefined;

  if (type !== "income" && type !== "expense" && type !== "all") {
    return { type: "all", from_date, to_date };
  }

  return { type, from_date, to_date };
};

type TransactionIdQuery = {
  accountId?: string;
  transactionId?: string;
};

const requestUtils = {
  getOptionQuery(req: Request): OptionParam {
    return getBaseOption(req);
  },

  getAccountOptionQuery(req: Request): AccountOptionParam {
    return extendOption(req, parseAccountExtra);
  },

  getCategoryOptionQuery(req: Request): CategoryOptionParam {
    return extendOption(req, parseCategoryExtra);
  },

  getTransactionOptionQuery(req: Request): TransactionOptionParam {
    return extendOption(req, parseTransactionExtra);
  },
  getTransactionIdQuery(req: Request): TransactionIdQuery {
    const accountId = req.query.accountId?.toString() ?? undefined;
    const transactionId = req.query.transactionId?.toString() ?? undefined;
    return { accountId, transactionId };
  },
};

export default requestUtils;
