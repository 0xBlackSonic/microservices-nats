import { body } from "express-validator";
import { AuthProviders } from "../../enums/providers.enum";

export const signinValidationRules = [
  body("email").isEmail().withMessage("Email is required"),
  body("password")
    .trim()
    .custom((value, { req }) => {
      if (
        req.body.provider === AuthProviders.Credentials && !value
      ) {
        throw new Error("Password is required");
      }

      if (req.body.provider === AuthProviders.Email && !value) {
        throw new Error("Access Token is required");
      }

      return true;
    }),
];
