import { connect } from "@nats-io/transport-node";
import { jetstream, jetstreamManager } from "@nats-io/jetstream";
import type { JetStreamClient, JetStreamManager } from "@nats-io/jetstream";
import { config } from "../configs";

class NatsLoader {
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

  async connect() {
    try {
      const client = await connect({ servers: config.nats.url });

      this._jsManager = await jetstreamManager(client);
      this._jsClient = jetstream(client);

      console.log("Connected to NATS JetStream");
    } catch (err) {
      console.error(err);
    }
  }
}

export const natsLoader = new NatsLoader();
