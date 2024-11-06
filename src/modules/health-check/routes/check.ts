import express, { Request, Response } from "express";

const route = express.Router();

route.get("/api/check", async (req: Request, res: Response) => {
  res.send("We're live");
});

export { route as healthCheckRouter };
