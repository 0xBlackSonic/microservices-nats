import { config } from "../configs";
import nodemailer, { Transporter } from "nodemailer";

export class SMTPLoader {
  private _transporter?: Transporter;

  get transporter() {
    if (!this._transporter) {
      throw new Error("Transporter is nor defined");
    }

    return this._transporter;
  }

  async connect() {
    if (config.smtp.active) {
      if (
        !config.smtp.url ||
        !config.smtp.username ||
        !config.smtp.password ||
        !config.smtp.port
      ) {
        throw new Error("All SMTP environment variables must be defined");
      }

      this._transporter = nodemailer.createTransport({
        host: config.smtp.url,
        port: config.smtp.port,
        secure: config.smtp.secure,
        auth: {
          user: config.smtp.username,
          pass: config.smtp.password,
        },
      });

      return new Promise<void>((resolve, reject) => {
        this._transporter!.verify((err, success) => {
          if (err) {
            console.error("SMTP Loader Error -", err);
            reject(err);
          }
          console.log("SMTP transporter initialized");
          resolve();
        });
      });
    }
  }
}

export const smtpLoader = new SMTPLoader();
