import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

jest.mock("../loaders/nats.loader");

let mongo: MongoMemoryServer | undefined;

// Initialize MongoDB memory server
// Connect mongoose
beforeAll(async () => {
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
