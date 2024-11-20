import { CustomError } from "./custom.error";

export class SessionExpiredError extends CustomError {
  errorCode = 403;

  constructor() {
    super("Access token expired");

    Object.setPrototypeOf(this, SessionExpiredError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: "Access Token Expired",
      },
    ];
  }
}
