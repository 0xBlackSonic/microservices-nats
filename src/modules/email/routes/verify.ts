import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requestValidation } from "../../../middlewares/request-validation";
import { User } from "../../../models/user";
import { BadRequestError } from "../../../errors/bad-request-error";
import { AuthProviders } from "../../../enums/providers";

const route = express.Router();

route.post(
  "/api/auth/email/verify",
  [
    body("email").isEmail().withMessage("Email is required"),
    body("accessToken")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Access Token is required"),
  ],
  requestValidation,
  async (req: Request, res: Response) => {
    const { email, accessToken } = req.body;

    const user = await User.findOne({
      email,
      "accounts.provider": AuthProviders.Email,
      "accounts.accessToken": accessToken,
    });

    if (!user) {
      throw new BadRequestError("AccessToken is not valid");
    }

    const userAccount = user.accounts.find(
      (acc) => acc.provider === AuthProviders.Email
    );

    if (!userAccount!.active) {
      throw new BadRequestError("Access Token already used");
    }

    if (userAccount!.expires! < Date.now()) {
      throw new BadRequestError("Access Token expired");
    }

    userAccount!.active = false;
    await user.save();

    const jwt = user.generateJwtToken();
    const refresh = await user.generateRefreshToken();

    req.session = { jwt, refresh };

    res.send(user);
  }
);

export { route as verifyRouter };
