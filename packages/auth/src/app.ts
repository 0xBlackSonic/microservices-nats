import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { authUser, errorHandler, NotFoundError } from "@goblit/shared";

import { signupRouter } from "./routes/signup.route";
import { signinRouter } from "./routes/signin.route";
import { signoutRouter } from "./routes/signout.route";
import { protectedRouter } from "./routes/protected.route";
import { refreshRouter } from "./routes/refresh-session.route";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(authUser);

app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(refreshRouter);
app.use(protectedRouter);

app.all("*", (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
