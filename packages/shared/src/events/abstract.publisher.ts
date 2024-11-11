import { jetstream, jetstreamManager } from "@nats-io/jetstream";
import type { JetStreamClient, JetStreamManager } from "@nats-io/jetstream";
import { NatsConnection } from "@nats-io/nats-core/lib/core";

import { Subjects } from "./enums/subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];

  private _client: NatsConnection;
  private _jsm?: JetStreamManager;
  private _js?: JetStreamClient;

  constructor(client: NatsConnection) {
    this._client = client;
  }

  private async _initialize() {
    this._jsm = await jetstreamManager(this._client);
    this._js = jetstream(this._client);

    this._jsm.streams.add({
      name: this.subject.split(".")[0],
      subjects: [this.subject],
    });
  }

  async publish(data: T["data"]) {
    await this._initialize();

    const pub = await this._js!.publish(
      `${this.subject}`,
      JSON.stringify(data)
    );

    console.log(
      `Event published to subject ${this.subject} [Duplicated: ${pub.duplicate}]`
    );
  }
}
