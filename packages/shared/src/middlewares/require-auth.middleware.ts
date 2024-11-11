import { NextFunction, Request, Response } from "express";

import { AuthenticationError } from "../errors/authentication.error";

/*
  Require Authentication Middleware
  =================================

  Check if the user has an active session, 
  otherwise throw an Authentication Error.

*/

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.authUser) {
    throw new AuthenticationError("Session data missing");
  }

  if (req.jwtExpired) {
    throw new AuthenticationError("JWT expired");
  }

  next();
};
