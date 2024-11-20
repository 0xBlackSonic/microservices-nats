import express, { Request, Response } from "express";

const route = express.Router();

route.get("/api/auth/authuser", (req: Request, res: Response) => {
  res.send({
    authUser: req.authUser || null,
  });
});

export { route as authUserRouter };
