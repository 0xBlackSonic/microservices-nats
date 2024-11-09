import request from "supertest";

import { app } from "../../app";
import { AuthProviders } from "../../enums/providers.enum";

describe("Protected [With Credentials]", () => {
  it("returns a 401 response when user is not authenticated", async () => {
    await request(app).get("/api/protected").send().expect(401);
  });

  it("returns a 200 response when user is authenticated with credentials", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        provider: AuthProviders.Credentials,
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
});

describe("Protected [With Email]", () => {
  it("returns a 200 response when user is authenticated with email", async () => {
    const responseOne = await request(app)
      .post("/api/auth/signup")
      .send({
        provider: AuthProviders.Email,
        email: "test@test.com",
      })
      .expect(200);

    const responseTwo = await request(app)
      .post("/api/auth/signin")
      .send({
        provider: AuthProviders.Email,
        email: "test@test.com",
        password: responseOne.body.accessToken,
      })
      .expect(200);

    await request(app)
      .get("/api/protected")
      .set("Cookie", responseTwo.get("Set-Cookie")!)
      .send()
      .expect(200);
  });
});
