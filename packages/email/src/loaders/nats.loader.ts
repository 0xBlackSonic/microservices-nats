import { connect } from "@nats-io/transport-node";
import { jetstream, jetstreamManager } from "@nats-io/jetstream";
import { NatsConnection } from "@nats-io/nats-core/lib/core";
import type { JetStreamClient, JetStreamManager } from "@nats-io/jetstream";
import { config } from "../configs";

class NatsLoader {
  private _client?: NatsConnection;
  private _jsManager?: JetStreamManager;
  private _jsClient?: JetStreamClient;

  get jsManager() {
    if (!this._jsManager) {
      throw new Error("Cannot access JetStream Manager before connecting");
    }

    return this._jsManager;
  }

  get jsClient() {
    if (!this._jsClient) {
      throw new Error("Cannot access JetStream Client before connecting");
    }

    return this._jsClient;
  }

  get client() {
    if (!this._client) {
      throw new Error("Cannot access JetStream Client before connecting");
    }

    return this._client;
  }

  async connect() {
    try {
      this._client = await connect({ servers: config.nats.url });

      this._jsManager = await jetstreamManager(this._client);
      this._jsClient = jetstream(this._client);

      console.log("Connected to NATS JetStream");
    } catch (err) {
      console.error(err);
    }
  }
}

export const natsLoader = new NatsLoader();
