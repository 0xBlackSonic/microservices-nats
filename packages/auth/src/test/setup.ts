import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import { AuthEmailSignupPublisher } from "../events/publishers/auth-email-signup.publisher";

jest.mock("../services/mail.service");
jest.mock("../loaders/nats.loader");

AuthEmailSignupPublisher.prototype.publish = jest.fn();

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
