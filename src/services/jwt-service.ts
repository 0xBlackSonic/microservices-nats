import jwt, { JwtPayload } from "jsonwebtoken";

export interface Payload {
  id: string;
  email: string;
}

class JwtService {
  generateJWT(payload: Payload) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
  }

  generateRefresh(payload: Payload) {
    return jwt.sign(payload, process.env.REFRESH_SECRET_KEY!, {
      expiresIn: process.env.REFRESH_EXPIRATION,
    });
  }

  verifyJWT(token: string) {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY!) as Payload;

    return payload;
  }

  verifyRefresh(token: string) {
    const payload = jwt.verify(
      token,
      process.env.REFRESH_SECRET_KEY!
    ) as Payload;

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

export const jwtService = new JwtService();