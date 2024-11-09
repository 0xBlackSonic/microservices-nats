import { body } from "express-validator";
import { AuthProviders } from "../../enums/providers.enum";

export const signinValidationRules = [
  body("email").isEmail().withMessage("Email is required"),
  body("password")
    .trim()
    .custom((value, { req }) => {
      if (
        req.body.provider === AuthProviders.Credentials &&
        (value.length < 6 || value.length > 20)
      ) {
        throw new Error("Password must be between 6 and 20 characters");
      }

      if (req.body.provider === AuthProviders.Email && !value) {
        throw new Error("Access Token is required");
      }

      return true;
    }),
];
