import nodemailer, { Transporter } from "nodemailer";

export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

class MailService {
  private _transporter?: Transporter;

  async initializeMailServer(url: string, username: string, password: string) {
    this._transporter = nodemailer.createTransport({
      host: url,
      auth: {
        user: username,
        pass: password,
      },
    });

    await this._transporter.verify();
  }

  send(mailOptions: MailOptions): Promise<void> {
    if (!this._transporter) {
      throw new Error("Mail Server must be initialized");
    }

    this._transporter!.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });

    return new Promise((resolve, reject) => {
      this._transporter!.sendMail(mailOptions, (err, info) => {
        if (err) {
          reject(err);
        }
        console.log(info);
        resolve();
      });
    });
  }
}

export const mailService: MailService = new MailService();
