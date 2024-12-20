import { ValidationError } from "express-validator";
import { CustomError } from "./custom.error";

export class RequestValidationError extends CustomError {
  errorCode = 400;

  constructor(public errors: ValidationError[]) {
    super("Request Validation Error");

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      return {
        message: err.msg,
        field: err.type === "field" && err.path,
      };
    });
  }
}
