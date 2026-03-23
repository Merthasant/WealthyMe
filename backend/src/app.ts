import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();

const origin = `${process.env.CORS_ORIGIN}`;

app.use(
  cors({
    origin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;
