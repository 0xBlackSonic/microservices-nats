import express, { Request, Response } from "express";
import { User } from "../../../models/user";
import { authUser } from "../../../middlewares/auth-user";

const route = express.Router();

route.post("/api/users/signout", async (req: Request, res: Response) => {
  req.authUser &&
    (await User.removeSession(req.authUser.id, req.session!.refresh));

  req.session = null;

  res.send({});
});

export { route as signoutRouter };
