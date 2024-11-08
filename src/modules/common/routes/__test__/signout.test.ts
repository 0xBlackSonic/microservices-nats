import request from "supertest";

import { app } from "../../../../app";
import { User } from "../../../../models/user";
import { AuthProviders } from "../../../../enums/providers";
import { sign } from "jsonwebtoken";

describe("Auth - Signout test", () => {
  it("returns an empty session when user signout with credentials and delete the refresh token associated", async () => {
    const initial = await request(app)
      .post("/api/auth/credentials/signup")
      .send({
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

  it("returns an empty session when user signout with email and delete the refresh token associated", async () => {
    const signin = await request(app)
      .post("/api/auth/email/signin")
      .send({
        email: "test@test.com",
      })
      .expect(200);

    const initial = await request(app)
      .post("/api/auth/email/verify")
      .send({
        email: "test@test.com",
        accessToken: signin.body.accessToken,
      })
      .expect(200);

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
