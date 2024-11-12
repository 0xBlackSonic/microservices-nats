import { AckPolicy, DeliverPolicy } from "@nats-io/jetstream";
import type {
  JetStreamClient,
  JetStreamManager,
  JsMsg,
} from "@nats-io/jetstream";

import { Subjects } from "./enums/subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: Subjects;
  abstract queueName: string;
  abstract onMessage(data: T["data"], msg: JsMsg): void;

  private _jsm: JetStreamManager;
  private _js: JetStreamClient;

  constructor(jsManager: JetStreamManager, jsClient: JetStreamClient) {
    this._jsm = jsManager;
    this._js = jsClient;
  }

  private async _createStream() {
    await this._jsm.streams.add({
      name: this.subject.split(".")[0],
      subjects: [this.subject],
    });
  }

  private async _createConsumenr() {
    await this._jsm.consumers.add(this.subject.split(".")[0], {
      ack_policy: AckPolicy.Explicit,
      deliver_policy: DeliverPolicy.All,
      durable_name: this.queueName,
    });
  }

  async listen() {
    await this._createStream();
    await this._createConsumenr();

    const sub = await this._js.consumers.get(
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
