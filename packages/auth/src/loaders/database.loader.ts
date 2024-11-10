import mongoose from "mongoose";
import { config } from "../configs";

export class DatabaseLoader {
  async connect() {
    try {
      if (!config.db.host || !config.db.database) {
        throw new Error("MongoDB host and database must be defined");
      }

      let credentials: string = "";

      if (config.db.username && config.db.password) {
        credentials = `${config.db.username}:${config.db.password}@`;
      }

      await mongoose.connect(
        `mongodb://${credentials}${config.db.host}/${config.db.database}`
      );

      console.log("Database connected!");
    } catch (err) {
      console.error("Database Loader Error -", err);
      process.exit(1);
    }
  }
}

export const databaseLoader = new DatabaseLoader();
