import "dotenv/config";
import { ValidationError } from "./error.utils";

const jwtUtils = {
  // get access secret
  getAccessSecret(): string {
    const token = process.env.ACCESSTOKEN_SECRET ?? undefined;
    if (!token) throw new ValidationError("access token is undefined!");
    return `${token}`;
  },

  // get access secret
  getRefreshSecret(): string {
    const token = process.env.REFRESHTOKEN_SECRET ?? undefined;
    if (!token) throw new ValidationError("refresh token is undefined!");
    return `${token}`;
  },

  accessExpiresInString: "15m",
  refreshExpiresInString: "7d",
  accessExpiresInMiliSeconds: 15 * 60 * 1000,
  refreshExpiresInMiliSeconds: 7 * 24 * 60 * 60 * 1000,
};

export default jwtUtils;
