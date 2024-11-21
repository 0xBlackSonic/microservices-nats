import { htmlTemplate } from "./templates/email.template";

export const emailConfig = {
  signup: {
    from: "no-reply@resend.dev",
    subject: "Passwordless Email SignIn (Test)",
    baseUrl: "https://microservices.local",
    verificationPath: "/verify",
    template: function (email: string, accessToken: string) {
      return htmlTemplate({
        baseUrl: this.baseUrl,
        path: this.verificationPath,
        email,
        accessToken,
      });
    },
  },
};
