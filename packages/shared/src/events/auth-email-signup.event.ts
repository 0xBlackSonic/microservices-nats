import { Subjects } from "./enums/subjects";

export interface AuthEmailSignupEvent {
  subject: Subjects;
  data: {
    email: string;
    accessToken: string;
  };
}
