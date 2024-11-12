import {
  AuthEmailSignupEvent,
  EmailSendError,
  Listener,
  Subjects,
} from "@goblit/shared";
import { JsMsg } from "@nats-io/jetstream/lib/jsmsg";
import { mailService } from "../../services/mail.service";
import { emailConfig } from "../../configs/email.config";

export class AuthEmailSignupListener extends Listener<AuthEmailSignupEvent> {
  readonly subject = Subjects.AuthServiceEmailSignup;
  readonly queueName = "email-service";

  async onMessage(data: AuthEmailSignupEvent["data"], msg: JsMsg) {
    try {
      await mailService.send({
        from: emailConfig.signup.from,
        to: data.email,
        subject: emailConfig.signup.subject,
        html: emailConfig.signup.template(data.email, data.accessToken),
      });

      msg.ack();
    } catch (err) {
      console.log(err);
      throw new EmailSendError();
    }
  }
}
