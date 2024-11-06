import express, { Request, Response } from "express";
import { body } from "express-validator";

import { User } from "../../../models/user";
import { requestValidation } from "../../../middlewares/request-validation";
import { BadRequestError } from "../../../errors/bad-request-error";

const route = express.Router();

route.post(
  "/api/users/signup",
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

    const userExist = await User.findOne({
      email,
    });

    if (userExist) {
      throw new BadRequestError("User already exist");
    }

    const user = User.build({ email, password });
    await user.save();

    const jwt = await user.generateAccessToken();
    const refresh = await user.generateRefreshToken();

    req.session = { jwt, refresh };

    res.status(201).send(user);
  }
);

export { route as signupRouter };
