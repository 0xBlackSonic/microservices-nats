import { CustomError } from "./custom.error";

export class EmailSendError extends CustomError {
  errorCode = 503;

  constructor() {
    super("Error sending mail");

    Object.setPrototypeOf(this, EmailSendError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: "Error sending the email",
      },
    ];
  }
}
