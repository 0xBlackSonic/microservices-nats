import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requestValidation } from "../../../middlewares/request-validation";
import { User } from "../../../models/user";
import { AuthProviders } from "../../../enums/providers";
import { mailService } from "../../../services/mail-service";
import { MailAdapter } from "../../../adapters/mail";
import { emailConfig } from "../config";
import { EmailSendError } from "../../../errors/email-send-error";

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

    if (MailAdapter.isActive()) {
      try {
        await mailService.send({
          from: emailConfig.from,
          to: user.email,
          subject: emailConfig.subject,
          html: emailConfig.template(user.email, userAccount!.accessToken),
        });
      } catch (err) {
        console.log(err);
        throw new EmailSendError();
      }
    }

    res.send({ email, accessToken: userAccount!.accessToken });
  }
);

export { route as singinRouter };
