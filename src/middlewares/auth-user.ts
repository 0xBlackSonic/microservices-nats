import { NextFunction, Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";

import { jwtService, Payload } from "../services/jwt-service";
import { User } from "../models/user";
import { HashService } from "../services/hash-service";

declare global {
  namespace Express {
    interface Request {
      authUser: Payload;
    }
  }
}

/*  
  Authenticated User Middleware
  =============================

  Check if the user session is active, renew the JWT 
  if it is needed, and inject a new attribute to the 
  Request instance with the user payload data.

  This gives an easy way to have the user data anywhere.

*/
export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session || !req.session.jwt || !req.session.refresh) {
    return next();
  }

  try {
    const payload = jwtService.verifyJWT(req.session!.jwt) as Payload;

    req.authUser = payload;
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      try {
        const payload = jwtService.verifyRefresh(req.session!.refresh);

        const user = await User.findOne({
          _id: payload.id,
          "sessions.sessionToken": HashService.tokenHash(req.session!.refresh),
        });

        if (user) {
          req.session.jwt = user.generateJwtToken();
          req.authUser = payload;
        }
      } catch (err) {
        const { id } = jwtService.extractPayload(req.session!.refresh);

        await User.removeSession(id, req.session!.refresh);
      }
    }
  }

  next();
};
