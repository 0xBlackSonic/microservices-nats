export const config = {
  environment: process.env.ENVIRONMENT,
  port: process.env.PORT,
  db: {
    host: process.env.MONGODB_HOST,
    database: process.env.MONGODB_DATABASE,
    username: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
  },
  sessions: {
    oneUseTokenExpires: Number(process.env.ONE_USE_TOKEN_EXPIRARION),
  },
  smtp: {
    active: process.env.SEND_EMAIL === "true",
  },
  nats: {
    url: process.env.NATS_URL,
  },
};
