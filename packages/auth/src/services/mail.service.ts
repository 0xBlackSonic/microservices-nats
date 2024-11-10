import { smtpLoader } from "../loaders/smtp.loader";
import { config } from "../configs";

export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

class MailService {
  send(mailOptions: MailOptions): Promise<void> | undefined {
    if (config.smtp.active) {
      return new Promise((resolve, reject) => {
        smtpLoader.transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            reject(err);
          }
          console.log(info);
          resolve();
        });
      });
    }
  }
}

export const mailService: MailService = new MailService();
