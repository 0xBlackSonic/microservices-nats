import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  try {
    await mongoose.connect(`mongodb://mongodb/${process.env.MONGO_DB}`);

    console.log("Database connected!");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Server listen on port 3000");
  });
};

start();
