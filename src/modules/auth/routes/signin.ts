import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { requestValidation } from "../../../middlewares/request-validation";
import { User } from "../../../models/user";
import { BadRequestError } from "../../../errors/bad-request-error";
import { HashUtils } from "../../../helpers/hash-utils";
import { JwtUtils } from "../../../helpers/jwt-utils";

const route = express.Router();

route.post(
  "/api/users/signin",
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

    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError("Credentials are invalid");
    }

    if (!(await HashUtils.verify(user.password, password))) {
      throw new BadRequestError("Credentials are invalid");
    }

    const jwt = await user.generateAccessToken();
    const refresh = await user.generateRefreshToken();

    req.session = { jwt, refresh };

    res.send(user);
  }
);

export { route as signinRouter };
