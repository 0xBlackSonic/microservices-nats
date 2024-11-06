import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import * as dotenv from "dotenv";

import { errorHandler } from "./middlewares/error-handler";
import { authUser } from "./middlewares/auth-user";

import { NotFoundError } from "./errors/not-found-error";

import { healthCheckRoutes } from "./modules/health-check";
import { authRoutes } from "./modules/auth";
import { protectedRoutes } from "./modules/protected";

dotenv.config();

const app = express();
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(authUser);

app.use(healthCheckRoutes);
app.use(authRoutes);
app.use(protectedRoutes);

app.all("*", (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
