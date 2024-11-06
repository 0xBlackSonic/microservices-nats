import request from "supertest";

import { app } from "../../../../app";

describe("Protected - Check tests", () => {
  it("returns a 401 response when user is not authenticated", async () => {
    await request(app).get("/api/protected").send().expect(401);
  });

  it("returns a 200 response when user is authenticated", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);

    await request(app)
      .get("/api/protected")
      .set("Cookie", response.get("Set-Cookie")!)
      .send()
      .expect(200);
  });
});
