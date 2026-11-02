import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { httpLogger } from "./lib/utils/log.utils";

const app = express();

const origin = `${process.env.CORS_ORIGIN}`;

app.use(
  cors({
    origin,
    credentials: true,
    // exposedHeaders: ["x-new-access-token"],
  }),
);
app.use(express.json());

app.use(cookieParser());
app.use(bodyParser.json());
app.use(httpLogger);
app.use(express.urlencoded({ extended: true }));
// app.ts (sebelum route didaftarkan)
const bigIntReplacer = (_key: string, value: unknown) => {
  if (typeof value === "bigint") {
    if (
      value > BigInt(Number.MAX_SAFE_INTEGER) ||
      value < BigInt(Number.MIN_SAFE_INTEGER)
    ) {
      throw new RangeError(
        `BigInt ${value} terlalu besar untuk dikonversi ke number`,
      );
    }
    return Number(value);
  }
  return value;
};
app.set("json replacer", bigIntReplacer);
app.use("/api", router);

export default app;
