import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requestValidation } from "../../../middlewares/request-validation";
import { User } from "../../../models/user";
import { AuthProviders } from "../../../enums/providers";
import { mailService } from "../../../services/mail-service";

const route = express.Router();

route.post(
  "/api/auth/email/signin",
  [body("email").isEmail().withMessage("Email is required")],
  requestValidation,
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.buildSession({
      provider: AuthProviders.Email,
      email,
    });
    await user.save();

    const userAccount = user.accounts.find(
      (acc) => acc.provider === AuthProviders.Email
    );

    if (process.env.SEND_EMAIL === "true") {
      try {
        await mailService.send({
          from: "no-reply@resend.dev",
          to: user.email,
          subject: "Email access token test",
          html: `<html><body><h2>Esto es una prueba...</h2><p><a href="https://google.com">https://some-url.com/?email=${
            user.email
          }&token=${userAccount!.accessToken}</a></p></body></html>`,
        });
      } catch (err) {
        console.log(err);
      }
    }

    res.send({ email, accessToken: userAccount!.accessToken });
  }
);

export { route as singinRouter };
