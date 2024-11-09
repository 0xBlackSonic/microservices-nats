import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom.error";

/*
  Error Handler Middleware

  First check if exist an error with the
  instance of the custom error class and
  returns a serialized response error.

  Otherwise log in console the error and
  returns a generic response error

*/

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.errorCode).send({ errors: err.serializeErrors() });
    return next();
  }

  console.log(err);

  res.status(400).send({ errors: [{ message: "Something went wrong" }] });

  next();
};
