import {
  AckPolicy,
  DeliverPolicy,
  jetstream,
  jetstreamManager,
} from "@nats-io/jetstream";
import type {
  JetStreamClient,
  JetStreamManager,
  JsMsg,
} from "@nats-io/jetstream";
import { NatsConnection } from "@nats-io/nats-core";

import { Subjects } from "./enums/subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: Subjects;
  abstract queueName: string;
  abstract onMessage(data: T["data"], msg: JsMsg): void;

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

    await this._jsm.consumers.add(this.subject.split(".")[0], {
      ack_policy: AckPolicy.Explicit,
      deliver_policy: DeliverPolicy.All,
      durable_name: this.queueName,
    });
  }

  async listen() {
    await this._initialize();

    const sub = await this._js!.consumers.get(
      this.subject.split(".")[0],
      this.queueName
    );

    await sub.consume({
      callback: (msg) => {
        console.log(`Message received: ${this.subject} / ${this.queueName}`);

        const parsedData = JSON.parse(msg.string());
        this.onMessage(parsedData, msg);
      },
    });
  }
}
