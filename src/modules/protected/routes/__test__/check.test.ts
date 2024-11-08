import request from "supertest";

import { app } from "../../../../app";
import { AuthProviders } from "../../../../enums/providers";

describe("Protected - Check tests", () => {
  it("returns a 401 response when user is not authenticated", async () => {
    await request(app).get("/api/protected").send().expect(401);
  });

  it("returns a 200 response when user is authenticated with credentials", async () => {
    const response = await request(app)
      .post("/api/auth/credentials/signup")
      .send({
        email: "test@test.com",
        password: "password",
        passwordConfirmation: "password",
      })
      .expect(201);

    await request(app)
      .get("/api/protected")
      .set("Cookie", response.get("Set-Cookie")!)
      .send()
      .expect(200);
  });

  it("returns a 200 response when user is authenticated with email", async () => {
    const signin = await request(app)
      .post("/api/auth/email/signin")
      .send({
        email: "test@test.com",
      })
      .expect(200);

    const response = await request(app)
      .post("/api/auth/email/verify")
      .send({
        email: "test@test.com",
        accessToken: signin.body.accessToken,
      })
      .expect(200);

    await request(app)
      .get("/api/protected")
      .set("Cookie", response.get("Set-Cookie")!)
      .send()
      .expect(200);
  });
});
