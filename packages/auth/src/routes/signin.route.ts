import express, { Request, Response } from "express";
import { requestValidation } from "@goblit/shared";

import { signinValidationRules } from "./validations/signin.validation";
import { SigninService } from "../services/signin.service";

const route = express.Router();

route.post(
  "/api/auth/signin",
  signinValidationRules,
  requestValidation,
  async (req: Request, res: Response) => {
    const { provider, email, password } = req.body;

    const signinInstance = new SigninService(provider);
    await signinInstance.verify(email, password);

    const { user, jwt, refresh } = signinInstance.user;

    req.session = { jwt, refresh };

    res.send(user);
  }
);

export { route as signinRouter };
