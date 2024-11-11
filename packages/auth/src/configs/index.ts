import * as dotenv from "dotenv";

dotenv.config();

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
    jwtKey: process.env.JWT_SECRET_KEY,
    jwtExpire: process.env.JWT_EXPIRATION,
    refreshKey: process.env.REFRESH_SECRET_KEY,
    refreshExpire: process.env.REFRESH_EXPIRATION,
    oneUseTokenExpires: Number(process.env.ONE_USE_TOKEN_EXPIRARION),
  },
  smtp: {
    active: process.env.SEND_EMAIL === "true",
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
