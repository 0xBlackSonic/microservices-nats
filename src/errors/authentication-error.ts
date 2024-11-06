import { CustomError } from "./custom-error";

export class AuthenticationError extends CustomError {
  errorCode = 401;

  constructor() {
    super("Authentication error");

    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: "Authentication error",
      },
    ];
  }
}
