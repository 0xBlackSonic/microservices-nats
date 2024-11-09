import { config } from "../configs";
import { mailService } from "../services/mail.service";

export class SMTPLoader {
  static isActive() {
    return config.smtp.active;
  }

  static async connect() {
    if (config.smtp.active) {
      if (
        !config.smtp.url ||
        !config.smtp.username ||
        !config.smtp.password ||
        !config.smtp.port
      ) {
        throw new Error("All SMTP environment variables must be defined");
      }

      try {
        await mailService.initializeMailServer(
          config.smtp.url,
          config.smtp.username,
          config.smtp.password,
          config.smtp.port,
          config.smtp.secure
        );

        console.log("SMTP transporter initialized");
      } catch (err) {
        console.error("SMTP Loader Error -", err);
        process.exit(1);
      }
    }
  }
}
