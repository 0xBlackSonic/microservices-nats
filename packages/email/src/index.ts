import { AuthEmailSignupListener } from "./events/listeners/auth-email-signup.listener";
import { natsLoader } from "./loaders/nats.loader";
import { smtpLoader } from "./loaders/smtp.loader";

const start = async () => {
  try {
    await natsLoader.connect();
    await smtpLoader.connect();

    process.on("SIGINT", () => natsLoader.client.close());
    process.on("SIGTERM", () => natsLoader.client.close());

    new AuthEmailSignupListener(
      natsLoader.jsManager,
      natsLoader.jsClient
    ).listen();
  } catch (err) {
    console.error(err);
  }
};

start();
