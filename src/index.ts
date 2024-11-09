import { app } from "./app";
import { DatabaseAdapter } from "./adapters/database.adapter";
import { MailAdapter } from "./adapters/mail.adapter";

const start = async () => {
  await DatabaseAdapter.connect();
  await MailAdapter.connect();

  app.listen(3000, () => {
    console.log("Server listen on port 3000");
  });
};

start();
