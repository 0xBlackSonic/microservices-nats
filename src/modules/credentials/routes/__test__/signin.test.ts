import request from "supertest";

import { app } from "../../../../app";
import { User } from "../../../../models/user";
import { AuthProviders } from "../../../../enums/providers";

describe("Auth - Signin tests", () => {
  it("returns a 400 response when email is invalid", async () => {
    const response = await request(app)
      .post("/api/auth/credentials/signin")
      .send({
        email: "",
        password: "password",
      })
      .expect(400);

    await request(app)
      .post("/api/auth/credentials/signin")
      .send({
        email: "test@test",
        password: "password",
      })
      .expect(400);
  });

  it("returns a 400 response  when password is invalid", async () => {
    await request(app)
      .post("/api/auth/credentials/signin")
      .send({
        provider: AuthProviders.Credentials,
        email: "test@test.com",
        password: "1234",
      })
      .expect(400);
  });

  it("returns a 400 response when user is not registered", async () => {
    await request(app)
      .post("/api/auth/credentials/signin")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(400);
  });

  it("returns a 400 response when user exists but account type does not exist", async () => {
    const user = await User.buildSession({
      provider: AuthProviders.Email,
      email: "test@test.com",
    });
    await user.save();

    await request(app)
      .post("/api/auth/credentials/signin")
      .send({
        email: "test@test.com",
        password: "Password",
      })
      .expect(400);
  });

  it("returns a 400 response when user exists but password is not valid", async () => {
    const user = await User.build({
      provider: AuthProviders.Credentials,
      email: "test@test.com",
      password: "password",
    });
    await user.save();

    await request(app)
      .post("/api/auth/credentials/signin")
      .send({
        email: "test@test.com",
        password: "wrongPassword",
      })
      .expect(400);
  });

  it("returns a 200 response when user is logged in successfuly and set a cookie", async () => {
    const user = await User.build({
      provider: AuthProviders.Credentials,
      email: "test@test.com",
      password: "password",
    });
    await user.save();

    const response = await request(app)
      .post("/api/auth/credentials/signin")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});
