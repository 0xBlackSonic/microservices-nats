import type { JetStreamClient, JetStreamManager } from "@nats-io/jetstream";

import { Subjects } from "./enums/subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];

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

  async publish(data: T["data"]) {
    await this._createStream();

    const pub = await this._js.publish(`${this.subject}`, JSON.stringify(data));

    console.log(
      `Event published to subject ${this.subject} [Duplicated: ${pub.duplicate}]`
    );
  }
}
