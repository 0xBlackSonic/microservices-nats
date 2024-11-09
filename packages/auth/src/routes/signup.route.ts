import express, { Request, Response } from "express";
import { requestValidation } from "../middlewares/request-validation.middleware";
import { signupValidationsRules } from "./validations/signup.validation";
import { SignupService } from "../services/signup.service";

const route = express.Router();

route.post(
  "/api/auth/signup",
  signupValidationsRules,
  requestValidation,
  async (req: Request, res: Response) => {
    const { provider, email, password } = req.body;

    const userInstance = new SignupService(provider);
    await userInstance.buildUser(email, password);

    req.session = userInstance.sessionTokens;

    res.status(userInstance.responseCode).send(userInstance.user);
  }
);

export { route as signupRouter };
