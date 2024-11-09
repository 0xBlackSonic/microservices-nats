import { body } from "express-validator";
import { AuthProviders } from "../../enums/providers.enum";

export const signupValidationsRules = [
  body("provider")
    .isIn(Object.values(AuthProviders))
    .withMessage("Provider is required"),
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

      return true;
    }),
  body("passwordConfirmation").custom((value, { req }) => {
    if (
      req.body.provider === AuthProviders.Credentials &&
      value !== req.body.password
    ) {
      throw new Error("Passwords does not match");
    }

    return true;
  }),
];
