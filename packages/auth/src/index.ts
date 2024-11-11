import { app } from "./app";
import { config } from "./configs";
import { databaseLoader } from "./loaders/database.loader";
import { natsLoader } from "./loaders/nats.loader";
import { smtpLoader } from "./loaders/smtp.loader";

const start = async () => {
  await databaseLoader.connect();
  await smtpLoader.connect();
  await natsLoader.connect();

  app.listen(config.port, () => {
    console.log(`Server listen on port 3000 [${config.environment}]`);
  });
};

start();
