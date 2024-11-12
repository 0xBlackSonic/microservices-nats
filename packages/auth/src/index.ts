import { app } from "./app";
import { config } from "./configs";
import { databaseLoader } from "./loaders/database.loader";
import { natsLoader } from "./loaders/nats.loader";

const start = async () => {
  await databaseLoader.connect();
  await natsLoader.connect();

  process.on("SIGINT", () => natsLoader.client.close());
  process.on("SIGTERM", () => natsLoader.client.close());

  app.listen(config.port, () => {
    console.log(`Server listen on port 3000 [${config.environment}]`);
  });
};

start();
