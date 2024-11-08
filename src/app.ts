import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import * as dotenv from "dotenv";

import { errorHandler } from "./middlewares/error-handler";
import { authUser } from "./middlewares/auth-user";

import { NotFoundError } from "./errors/not-found-error";

import { credentialsRoutes } from "./modules/credentials";
import { protectedRoutes } from "./modules/protected";
import { commonRoutes } from "./modules/common";

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

app.use(credentialsRoutes);
app.use(commonRoutes);
app.use(protectedRoutes);

app.all("*", (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
