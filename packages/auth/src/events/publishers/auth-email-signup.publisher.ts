import { AuthEmailSignupEvent, Publisher, Subjects } from "@goblit/shared";

export class AuthEmailSignupPublisher extends Publisher<AuthEmailSignupEvent> {
  readonly subject = Subjects.AuthServiceEmailSignup;
}
