import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { requestValidation } from "../../../middlewares/request-validation";
import { User } from "../../../models/user";
import { BadRequestError } from "../../../errors/bad-request-error";
import { HashService } from "../../../services/hash-service";
import { AuthProviders } from "../../../enums/providers";

const route = express.Router();

route.post(
  "/api/auth/credentials/signin",
  [
    body("email").isEmail().withMessage("Email is required"),
    body("password")
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage("Password must be between 6 and 20 characters"),
  ],
  requestValidation,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
      "accounts.provider": AuthProviders.Credentials,
    });

    if (!user) {
      throw new BadRequestError("Credentials are invalid");
    }

    const userAccount = user.accounts.find(
      (acc) => acc.provider === AuthProviders.Credentials
    );

    if (!(await HashService.verify(userAccount!.accessToken, password))) {
      throw new BadRequestError("Credentials are invalid");
    }

    const jwt = user.generateJwtToken();
    const refresh = await user.generateRefreshToken();

    req.session = { jwt, refresh };

    res.send(user);
  }
);

export { route as signinRouter };
