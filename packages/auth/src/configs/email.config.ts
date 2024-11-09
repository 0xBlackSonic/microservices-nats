import { htmlTemplate } from "./templates/email.template";

export const emailConfig = {
  from: "no-reply@resend.dev",
  subject: "Passwordless Email SignIn (Test)",
  baseUrl: "https://some-frontend-url.com",
  verificationPath: "/auth/verify",
  template: function (email: string, accessToken: string) {
    return htmlTemplate({
      baseUrl: this.baseUrl,
      path: this.verificationPath,
      email,
      accessToken,
    });
  },
};
