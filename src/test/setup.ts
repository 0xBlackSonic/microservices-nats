import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo: MongoMemoryServer | undefined;

// Initialize MongoDB memory server
// Connect mongoose
beforeAll(async () => {
  process.env.JWT_SECRET_KEY = "test-jwt-key";
  process.env.JWT_EXPIRATION = "1m";
  process.env.REFRESH_SECRET_KEY = "test-refresh-key";
  process.env.REFRESH_EXPIRATION = "10m";

  mongo = await MongoMemoryServer.create();

  await mongoose.connect(mongo.getUri(), {});
});

// Delete all collections before each test
beforeEach(async () => {
  const collections = await mongoose.connection.db?.collections();

  for (let collection of collections!) {
    await collection.deleteMany({});
  }
});

// Stop MongoDB memory server
// Close mongoose connection
afterAll(async () => {
  if (mongo) {
    mongo.stop();
  }

  await mongoose.connection.close();
});
