import express, { Request, Response } from "express";
import { requestValidation } from "../middlewares/request-validation.middleware";
import { signupValidationsRules } from "./validations/signup.validation";
import { IEmailResponse, SignupService } from "../services/signup.service";
import { mailService } from "../services/mail.service";
import { emailConfig } from "../configs/email.config";
import { AuthProviders } from "../enums/providers.enum";

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
      (await mailService.send({
        from: emailConfig.signup.from,
        to: email,
        subject: emailConfig.signup.subject,
        html: emailConfig.signup.template(
          email,
          (userInstance.user as IEmailResponse).accessToken
        ),
      }));

    req.session = userInstance.sessionTokens;

    res.status(userInstance.responseCode).send(userInstance.user);
  }
);

export { route as signupRouter };
