import { mailService } from "../services/mail.service";

export class MailAdapter {
  static isActive() {
    return process.env.SEND_EMAIL === "true" ? true : false;
  }

  static async connect() {
    if (process.env.SEND_EMAIL === "true") {
      if (
        !process.env.SEND_EMAIL ||
        !process.env.SMTP_URL ||
        !process.env.SMTP_USERNAME ||
        !process.env.SMTP_PASSWORD ||
        !process.env.SMTP_PORT ||
        !process.env.SMTP_SECURE
      ) {
        throw new Error("All SMTP environment variables must be defined");
      }

      try {
        await mailService.initializeMailServer(
          process.env.SMTP_URL!,
          process.env.SMTP_USERNAME!,
          process.env.SMTP_PASSWORD!,
          Number(process.env.SMTP_PORT!),
          process.env.SMTP_SECURE! === "true" ? true : false
        );

        console.log("SMTP transporter initialized");
      } catch (err) {
        console.error("Mail Adapter Error -", err);
        process.exit(1);
      }
    }
  }
}
