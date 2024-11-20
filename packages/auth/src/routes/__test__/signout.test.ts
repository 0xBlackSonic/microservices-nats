import request from "supertest";

import { app } from "../../app";
import { AuthProviders } from "../../enums/providers.enum";
import { User } from "../../models/user.model";

describe("Auth Signout [With Credentials]", () => {
  it("returns an empty session when user signout with credentials and delete the refresh token associated", async () => {
    const initial = await request(app)
      .post("/api/auth/signup")
      .send({
        provider: AuthProviders.Credentials,
        email: "test@test.com",
        password: "password",
        passwordConfirmation: "password",
      })
      .expect(201);

    let user = await User.findById(initial.body.id);
    expect(user!.sessions.length).toEqual(1);

    const response = await request(app)
      .post("/api/auth/signout")
      .set("Cookie", initial.get("Set-Cookie")!)
      .send()
      .expect(200);

    expect(response.get("Set-Cookie")![0]).toEqual(
      "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
    );

    user = await User.findById(initial.body.id);
    expect(user!.sessions.length).toEqual(0);
  });
});

describe("Auth Signout [With Email]", () => {
  it("returns an empty session when user signout with email and delete the refresh token associated", async () => {
    const { user, accessToken } = await User.buildSession({
      provider: AuthProviders.Email,
      email: "test@test.com",
    });
    await user.save();

    const initial = await request(app)
      .post("/api/auth/signin")
      .send({
        provider: AuthProviders.Email,
        email: "test@test.com",
        password: accessToken,
      })
      .expect(200);

    let updatedUser = await User.findById(initial.body.id);
    expect(updatedUser!.sessions.length).toEqual(1);

    const response = await request(app)
      .post("/api/auth/signout")
      .set("Cookie", initial.get("Set-Cookie")!)
      .send()
      .expect(200);

    expect(response.get("Set-Cookie")![0]).toEqual(
      "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
    );

    updatedUser = await User.findById(initial.body.id);
    expect(updatedUser!.sessions.length).toEqual(0);
  });
});
