import express, { Request, Response } from "express";
import { BadRequestError, requestValidation } from "@goblit/shared";

import { signinValidationRules } from "./validations/signin.validation";
import { SigninService } from "../services/signin/signin.service";
import { AuthProviders } from "../enums/providers.enum";
import { SigninCredentialsService } from "../services/signin/signin-credentials.service";
import { SigninEmailService } from "../services/signin/signin-email.service";

const route = express.Router();

route.post(
  "/api/auth/signin",
  signinValidationRules,
  requestValidation,
  async (req: Request, res: Response) => {
    const { provider, email, password } = req.body;
    let signinInstance: SigninService;

    switch (provider) {
      case AuthProviders.Credentials:
        signinInstance = new SigninCredentialsService(provider);
        break;
      case AuthProviders.Email:
        signinInstance = new SigninEmailService(provider);
        break;
      default:
        throw new BadRequestError("Provider does not exist!");
    }
    
    const { user, jwt, refresh } = await signinInstance.verify(email, password);

    req.session = { jwt, refresh };

    res.send(user);
  }
);

export { route as signinRouter };
