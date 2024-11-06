import request from "supertest";

import { app } from "../../../../app";

describe("Health Check - Check test", () => {
  it("returns a 200 response when health check is called", async () => {
    await request(app).get("/api/check").send().expect(200);
  });
});
