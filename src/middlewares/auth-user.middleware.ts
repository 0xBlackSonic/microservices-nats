import { NextFunction, Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";

import { jwtUtils, Payload } from "../helpers/jwt.utils";
import { User } from "../models/user.model";
import { HashUtils } from "../helpers/hash.utils";

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
    const payload = jwtUtils.verifyJWT(req.session!.jwt) as Payload;

    req.authUser = payload;
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      try {
        const payload = jwtUtils.verifyRefresh(req.session!.refresh);

        const user = await User.findOne({
          _id: payload.id,
          "sessions.sessionToken": HashUtils.tokenHash(req.session!.refresh),
        });

        if (user) {
          req.session.jwt = user.generateJwtToken();
          req.authUser = payload;
        }
      } catch (err) {
        const { id } = jwtUtils.extractPayload(req.session!.refresh);

        await User.removeSession(id, req.session!.refresh);
      }
    }
  }

  next();
};
