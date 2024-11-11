import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";

export interface Payload {
  id: string;
  email: string;
}

class JwtUtils {
  generateJWT(payload: Payload) {
    return jwt.sign(payload, config.sessions.jwtKey!, {
      expiresIn: config.sessions.jwtExpire,
    });
  }

  generateRefresh(payload: Payload) {
    return jwt.sign(payload, config.sessions.refreshKey!, {
      expiresIn: config.sessions.refreshExpire,
    });
  }

  verifyJWT(token: string) {
    const payload = jwt.verify(token, config.sessions.jwtKey!) as Payload;

    return payload;
  }

  verifyRefresh(token: string) {
    const payload = jwt.verify(token, config.sessions.refreshKey!) as Payload;

    return payload;
  }

  extractPayload(token: string) {
    return jwt.decode(token) as Payload;
  }

  getExpirationTime(token: string) {
    const { exp } = jwt.decode(token) as JwtPayload;

    return exp;
  }
}

export const jwtUtils = new JwtUtils();
