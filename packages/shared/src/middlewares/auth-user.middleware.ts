import { NextFunction, Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";

import { jwtUtils, Payload } from "../helpers/jwt.utils";

declare global {
  namespace Express {
    interface Request {
      authUser: Payload;
      jwtExpired: boolean;
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

  let payload: Payload;

  try {
    payload = jwtUtils.verifyJWT(req.session!.jwt) as Payload;

    req.authUser = payload;
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      payload = jwtUtils.extractPayload(req.session!.jwt) as Payload;

      req.authUser = payload;
      req.jwtExpired = true;
    }
  }

  next();
};