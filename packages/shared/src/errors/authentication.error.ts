import { CustomError } from "./custom.error";

export class AuthenticationError extends CustomError {
  errorCode = 401;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.message,
      },
    ];
  }
}
