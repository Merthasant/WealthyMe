import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();

const origin = `${process.env.CORS_ORIGIN}`;

app.use(
  cors({
    origin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

export default app;
