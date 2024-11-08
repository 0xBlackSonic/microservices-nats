import request from "supertest";

import { app } from "../../../../app";
import { User } from "../../../../models/user";
import { AuthProviders } from "../../../../enums/providers";

describe("Auth - Signup tests", () => {
  it("returns a 400 response when email is not valid", async () => {
    await request(app)
      .post("/api/auth/credentials/signup")
      .send({
        email: "",
        password: "password",
        passwordConfirmation: "password",
      })
      .expect(400);

    await request(app)
      .post("/api/auth/credentials/signup")
      .send({
        email: "test@test",
        password: "password",
        passwordConfirmation: "password",
      })
      .expect(400);
  });

  it("returns a 400 response when password is not valid", async () => {
    await request(app)
      .post("/api/auth/credentials/signup")
      .send({
        email: "test@test.com",
        password: "1234",
        passwordConfirmation: "1234",
      })
      .expect(400);

    await request(app)
      .post("/api/auth/credentials/signup")
      .send({
        email: "test@test.com",
        password: "password",
        passwordConfirmation: "drowssap",
      })
      .expect(400);
  });

  it("returns a 400 response when user already exist", async () => {
    const user = await User.build({
      provider: AuthProviders.Credentials,
      email: "test@test.com",
      password: "password",
    });
    await user.save();

    await request(app)
      .post("/api/auth/credentials/signup")
      .send({
        email: "test@test.com",
        password: "password",
        passwordConfirmation: "password",
      })
      .expect(400);
  });

  it("returns a 201 reponse when user successfuly register and set a cookie", async () => {
    const response = await request(app)
      .post("/api/auth/credentials/signup")
      .send({
        email: "test@test.com",
        password: "password",
        passwordConfirmation: "password",
      })
      .expect(201);

    expect(response.body.email).toEqual("test@test.com");
    expect(response.get("Set-Cookie")).toBeDefined();
  });
});
