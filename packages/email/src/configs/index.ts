export const config = {
  environment: process.env.ENVIRONMENT,
  smtp: {
    url: process.env.SMTP_URL,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
  },
  nats: {
    url: process.env.NATS_URL,
  },
};
