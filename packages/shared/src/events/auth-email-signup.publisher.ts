import { Publisher } from "./abstract.publisher";
import { AuthEmailSignupEvent } from "./auth-email-signup.event";
import { Subjects } from "./enums/subjects";

export class AuthEmailSignupPublisher extends Publisher<AuthEmailSignupEvent> {
  readonly subject = Subjects.AuthServiceEmailSignup;
}
