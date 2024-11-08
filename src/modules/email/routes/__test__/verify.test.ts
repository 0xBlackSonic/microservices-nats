import request from "supertest";

import { app } from "../../../../app";
import { User } from "../../../../models/user";
import { AuthProviders } from "../../../../enums/providers";

describe("Email Auth - Verify tests", () => {
  it("returns a 400 response when email is invalid", async () => {
    await request(app)
      .post("/api/auth/email/verify")
      .send({
        email: "",
        accessToken: "testAccessToken",
      })
      .expect(400);

    await request(app)
      .post("/api/auth/email/verify")
      .send({
        email: "test@test",
        accessToken: "testAccessToken",
      })
      .expect(400);
  });

  it("returns a 400 response when accessKey is not defined", async () => {
    await request(app)
      .post("/api/auth/email/verify")
      .send({
        email: "test@test.com",
        accessToken: "",
      })
      .expect(400);
  });

  it("returns a 400 response when user does not exist", async () => {
    await request(app)
      .post("/api/auth/email/verify")
      .send({
        email: "test@test.com",
        accessToken: "testAccessToken",
      })
      .expect(400);
  });

  it("returns a 400 response when user exist but does not have an email account", async () => {
    const user = await User.build({
      provider: AuthProviders.Credentials,
      email: "test@test.com",
      password: "password",
    });
    await user.save();

    await request(app)
      .post("/api/auth/email/verify")
      .send({
        email: "test@test.com",
        accessToken: "testAccessToken",
      })
      .expect(400);
  });

  it("returns a 400 response when user exist, have an email account but accessToken does not match", async () => {
    const user = await User.buildSession({
      provider: AuthProviders.Email,
      email: "test@test.com",
    });
    await user.save();

    await request(app)
      .post("/api/auth/email/verify")
      .send({
        email: "test@test.com",
        accessToken: "testAccessToken",
      })
      .expect(400);
  });

  it("returns a 400 response when accessToken is already used", async () => {
    const user = await User.buildSession({
      provider: AuthProviders.Email,
      email: "test@test.com",
    });
    user.accounts[0].active = false;

    await user.save();

    await request(app)
      .post("/api/auth/email/verify")
      .send({
        email: "test@test.com",
        accessToken: user.accounts[0].accessToken,
      })
      .expect(400);
  });

  it("returns a 400 response when accessToken is expired", async () => {
    const user = await User.buildSession({
      provider: AuthProviders.Email,
      email: "test@test.com",
    });
    user.accounts[0].expires = Date.now() - 1000;

    await user.save();

    await request(app)
      .post("/api/auth/email/verify")
      .send({
        email: "test@test.com",
        accessToken: user.accounts[0].accessToken,
      })
      .expect(400);
  });

  it("set accessToken state to false, set a cookie and returns a 200 response", async () => {
    await request(app)
      .post("/api/auth/email/signin")
      .send({
        email: "test@test.com",
      })
      .expect(200);

    const user = await User.findOne({
      email: "test@test.com",
    });

    const response = await request(app)
      .post("/api/auth/email/verify")
      .send({
        email: "test@test.com",
        accessToken: user!.accounts[0].accessToken,
      })
      .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();

    const updatedUser = await User.findOne({
      email: "test@test.com",
    });

    expect(updatedUser!.accounts[0].active).toBeFalsy();
  });
});
