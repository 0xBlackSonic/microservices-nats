import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation.error";

/*
  Request Validation Middleware

  Check if exist some express-validator 
  errors into the request instance and 
  throw a Request Validation Error 

*/

export const requestValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  next();
};
