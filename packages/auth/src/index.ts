import { app } from "./app";
import { config } from "./configs";
import { databaseLoader } from "./loaders/database.loader";
import { smtpLoader } from "./loaders/smtp.loader";

const start = async () => {
  await databaseLoader.connect();
  await smtpLoader.connect();

  app.listen(config.port, () => {
    console.log(`Server listen on port 3000 [${config.environment}]`);
  });
};

start();
