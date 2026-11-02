import pino from "pino";
import pinoHttp from "pino-http";

const usePretty = process.env.NODE_ENV !== "production";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  base: {
    env: process.env.NODE_ENV || "development",
  },
  redact: {
    paths: [
      "password",
      "confPassword",
      "refreshToken",
      "accessToken",
      "*.password",
      "*.confPassword",
      "*.refreshToken",
      "*.accessToken",
      "*.*.refreshToken", // container.token.refreshToken
      "*.*.accessToken", // container.token.accessToken
      "req.headers.authorization",
      "req.headers.cookie",
      'res.headers["set-cookie"]',
    ],
    censor: "[REDACTED]",
  },
  ...(usePretty ? { transport: { target: "pino-pretty" } } : {}),
});

export const createLogger = ({ service }: { service: string }) =>
  logger.child({ service });

export const httpLogger = pinoHttp({
  logger: createLogger({ service: "http" }),
});
