import mongoose from "mongoose";

export class DatabaseAdapter {
  static async connect() {
    try {
      if (!process.env.MONGODB_DATABASE || !process.env.MONGODB_HOST) {
        throw new Error("MongoDB host and database must be defined");
      }

      let credentials: string = "";

      if (process.env.MONGODB_USER && process.env.MONGODB_PASSWORD) {
        credentials = `${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@`;
      }

      await mongoose.connect(
        `mongodb://${credentials}${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}`
      );

      console.log("Database connected!");
    } catch (err) {
      console.error("Database Adapter Error -", err);
      process.exit(1);
    }
  }
}
