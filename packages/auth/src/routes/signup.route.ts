import express, { Request, Response } from "express";
import { BadRequestError, requestValidation } from "@goblit/shared";

import { signupValidationsRules } from "./validations/signup.validation";
import { AuthProviders } from "../enums/providers.enum";
import { SignupService } from "../services/signup/signup.service";
import { SignupCredentialsService } from "../services/signup/signup-credentials.service";
import { SignupEmailService } from "../services/signup/signup-email.service";

const route = express.Router();

route.post(
  "/api/auth/signup",
  signupValidationsRules,
  requestValidation,
  async (req: Request, res: Response) => {
    const { provider, email, password } = req.body;
    let userInstance: SignupService;

    switch (provider) {
      case AuthProviders.Credentials:
        userInstance = new SignupCredentialsService(provider);
        break;
      case AuthProviders.Email:
        userInstance = new SignupEmailService(provider)
        break;
      default:
        throw new BadRequestError("Provider does not exist!");
    }
    
    await userInstance.buildUser(email, password);

    req.session = userInstance.sessionTokens;

    res.status(userInstance.responseCode).send(userInstance.user);
  }
);

export { route as signupRouter };
