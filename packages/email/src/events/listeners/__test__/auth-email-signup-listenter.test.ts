import { connect } from "@nats-io/transport-node";
import { AuthEmailSignupListener } from "../auth-email-signup.listener";
import { AuthEmailSignupEvent } from "@goblit/shared";
import type {
  JetStreamClient,
  JetStreamManager,
  JsMsg,
} from "@nats-io/jetstream";
import { mailService } from "../../../services/mail.service";
import { natsLoader } from "../../../loaders/nats.loader";

const res = natsLoader.client;

const setup = async () => {
  const listener = new AuthEmailSignupListener(
    natsLoader.jsManager,
    natsLoader.jsClient
  );

  const data: AuthEmailSignupEvent["data"] = {
    email: "test@test.com",
    accessToken: "TestAccessToken",
  };

  // @ts-ignore
  const msg: JsMsg = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

describe("Auth Mail Signup Listener", () => {
  it("execute the send mail function", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(mailService.send).toHaveBeenCalled();
  });

  it("acks the message", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
