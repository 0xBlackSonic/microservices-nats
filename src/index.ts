import mongoose from "mongoose";
import { app } from "./app";
import { mailService } from "./services/mail-service";

const start = async () => {
  if (
    (process.env.SEND_EMAIL === "true" && !process.env.SMTP_URL) ||
    !process.env.SMTP_USERNAME ||
    !process.env.SMTP_PASSWORD
  ) {
    throw new Error("SMTP environment variables must be defined");
  }

  try {
    await mongoose.connect(`mongodb://localhost/${process.env.MONGO_DB}`);

    console.log("Database connected!");

    if (process.env.SEND_EMAIL === "true") {
      await mailService.initializeMailServer(
        process.env.SMTP_URL!,
        process.env.SMTP_USERNAME!,
        process.env.SMTP_PASSWORD!
      );

      console.log("Mail server initialized");
    }
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Server listen on port 3000");
  });
};

start();
