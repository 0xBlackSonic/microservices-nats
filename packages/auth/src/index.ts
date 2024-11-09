import { app } from "./app";
import { config } from "./configs";
import { DatabaseLoader } from "./loaders/database.loader";
import { SMTPLoader } from "./loaders/mail.loader";

const start = async () => {
  await DatabaseLoader.connect();
  await SMTPLoader.connect();

  app.listen(config.port, () => {
    console.log(`Server listen on port 3000 [${config.environment}]`);
  });
};

start();
