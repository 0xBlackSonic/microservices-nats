import express, { Request, Response } from "express";
import { requireAuth } from "../../../middlewares/require-auth";

const route = express.Router();

route.get(
  "/api/protected",
  requireAuth,
  async (req: Request, res: Response) => {
    res.send("This is a protected url");
  }
);

export { route as protectedRouter };
