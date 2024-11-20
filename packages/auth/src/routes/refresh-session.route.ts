import { AuthenticationError } from "@goblit/shared";
import express, { Request, Response } from "express";

import {
  RefreshSession,
  RequestSession,
} from "../services/refresh-session.service";

const route = express.Router();

route.post("/api/auth/refresh", async (req: Request, res: Response) => {
  if (!req.session?.jwt || !req.session?.refresh) {
    throw new AuthenticationError("Session data missing");
  }

  const newSession = new RefreshSession(req.session as RequestSession);

  req.session = await newSession.refresh();

  res.send({});
});

export { route as refreshRouter };
