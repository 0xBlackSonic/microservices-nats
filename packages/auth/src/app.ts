import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler } from "./middlewares/error-handler.middleware";
import { authUser } from "./middlewares/auth-user.middleware";

import { NotFoundError } from "./errors/not-found.error";

import { signupRouter } from "./routes/signup.route";
import { signinRouter } from "./routes/signin.route";
import { signoutRouter } from "./routes/signout.route";
import { protectedRouter } from "./routes/protected.route";

const app = express();
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(authUser);

app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(protectedRouter);

app.all("*", (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
