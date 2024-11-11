import { NatsConnection } from "@nats-io/nats-core/lib/core";
import { connect } from "@nats-io/transport-node";
import { config } from "../configs";

class NatsLoader {
  private _client?: NatsConnection;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting");
    }

    return this._client;
  }

  async connect() {
    try {
      this._client = await connect({ servers: config.nats.url });

      console.log("Connected to NATS");
    } catch (err) {
      console.error(err);
    }
  }
}

export const natsLoader = new NatsLoader();
