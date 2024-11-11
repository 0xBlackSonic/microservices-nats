import { requireAuth } from "@goblit/shared";
import express, { Request, Response } from "express";

const route = express.Router();

route.get(
  "/api/protected",
  requireAuth,
  async (req: Request, res: Response) => {
    res.send("This is a protected url");
  }
);

export { route as protectedRouter };
