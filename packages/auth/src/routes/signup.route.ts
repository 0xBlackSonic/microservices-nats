import express, { Request, Response } from "express";
import { requestValidation } from "@goblit/shared";

import { signupValidationsRules } from "./validations/signup.validation";
import { IEmailResponse, SignupService } from "../services/signup.service";
import { AuthProviders } from "../enums/providers.enum";
import { natsLoader } from "../loaders/nats.loader";
import { config } from "../configs";
import { AuthEmailSignupPublisher } from "../events/publishers/auth-email-signup.publisher";

const route = express.Router();

route.post(
  "/api/auth/signup",
  signupValidationsRules,
  requestValidation,
  async (req: Request, res: Response) => {
    const { provider, email, password } = req.body;

    const userInstance = new SignupService(provider);
    await userInstance.buildUser(email, password);

    provider === AuthProviders.Email &&
      config.smtp.active &&
      (await new AuthEmailSignupPublisher(natsLoader.client).publish({
        email,
        accessToken: (userInstance.user as IEmailResponse).accessToken,
      }));

    req.session = userInstance.sessionTokens;

    res.status(userInstance.responseCode).send(userInstance.user);
  }
);

export { route as signupRouter };