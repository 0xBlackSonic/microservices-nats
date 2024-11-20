import request from "supertest";

import { app } from "../../app";
import { AuthProviders } from "../../enums/providers.enum";
import { User } from "../../models/user.model";

describe("Auth Signin [With Credentials]", () => {
  it("returns a 400 response when email is invalid", async () => {
    const response = await request(app)
      .post("/api/auth/signin")
      .send({
        provider: AuthProviders.Credentials,
        email: "",
        password: "password",
      })
      .expect(400);

    await request(app)
      .post("/api/auth/signin")
      .send({
        provider: AuthProviders.Credentials,
        email: "test@test",
        password: "password",
      })
      .expect(400);
  });

  it("returns a 400 response  when password is invalid", async () => {
    await request(app)
      .post("/api/auth/signin")
      .send({
        provider: AuthProviders.Credentials,
        email: "test@test.com",
        password: "1234",
      })
      .expect(400);
  });

  it("returns a 400 response when user is not registered", async () => {
    await request(app)
      .post("/api/auth/signin")
      .send({
        provider: AuthProviders.Credentials,
        email: "test@test.com",
        password: "password",
      })
      .expect(400);
  });

  it("returns a 400 response when user exists but not a Credentials account", async () => {
    const { user } = await User.buildSession({
      provider: AuthProviders.Email,
      email: "test@test.com",
    });
    await user.save();

    await request(app)
      .post("/api/auth/signin")
      .send({
        provider: AuthProviders.Credentials,
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
      .post("/api/auth/signin")
      .send({
        provider: AuthProviders.Credentials,
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
      .post("/api/auth/signin")
      .send({
        provider: AuthProviders.Credentials,
        email: "test@test.com",
        password: "password",
      })
      .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});

describe("Auth Signin [With Email]", () => {
  it("returns a 400 response when email is invalid", async () => {
    await request(app)
      .post("/api/auth/signin")
      .send({
        provider: AuthProviders.Email,
        email: "",
        password: "testAccessToken",
      })
      .expect(400);

    await request(app)
      .post("/api/auth/signin")
      .send({
        provider: AuthProviders.Email,
        email: "test@test",
        password: "testAccessToken",
      })
      .expect(400);
  });

  it("returns a 400 response when password is not defined", async () => {
    await request(app)
      .post("/api/auth/signin")
      .send({
        provider: AuthProviders.Email,
        email: "test@test.com",
        password: "",
      })
      .expect(400);
  });

  it("returns a 400 response when user does not exist", async () => {
    await request(app)
      .post("/api/auth/signin")
      .send({
        provider: AuthProviders.Email,
        email: "test@test.com",
        password: "testAccessToken",
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
      .post("/api/auth/signin")
      .send({
        provider: AuthProviders.Email,
        email: "test@test.com",
        password: "testAccessToken",
      })
      .expect(400);
  });

  it("returns a 400 response when user exist, have an email account but accessToken does not match", async () => {
    const { user } = await User.buildSession({
      provider: AuthProviders.Email,
      email: "test@test.com",
    });
    await user.save();

    await request(app)
      .post("/api/auth/signin")
      .send({
        provider: AuthProviders.Email,
        email: "test@test.com",
        password: "testAccessToken",
      })
      .expect(400);
  });

  it("returns a 400 response when accessToken is already used", async () => {
    const { user, accessToken } = await User.buildSession({
      provider: AuthProviders.Email,
      email: "test@test.com",
    });
    user.accounts[0].active = false;

    await user.save();

    await request(app)
      .post("/api/auth/signin")
      .send({
        provider: AuthProviders.Email,
        email: "test@test.com",
        password: accessToken,
      })
      .expect(400);
  });

  it("returns a 400 response when accessToken is expired", async () => {
    const { user, accessToken } = await User.buildSession({
      provider: AuthProviders.Email,
      email: "test@test.com",
    });
    user.accounts[0].expires = Date.now() - 1000;

    await user.save();

    await request(app)
      .post("/api/auth/signin")
      .send({
        provider: AuthProviders.Email,
        email: "test@test.com",
        password: accessToken,
      })
      .expect(400);
  });

  it("set accessToken state to false, set a cookie and returns a 200 response", async () => {
    const { user, accessToken } = await User.buildSession({
      provider: AuthProviders.Email,
      email: "test@test.com",
    });
    await user.save();

    const responseTwo = await request(app)
      .post("/api/auth/signin")
      .send({
        provider: AuthProviders.Email,
        email: "test@test.com",
        password: accessToken,
      })
      .expect(200);

    expect(responseTwo.get("Set-Cookie")).toBeDefined();

    const updatedUser = await User.findOne({
      email: "test@test.com",
    });

    expect(updatedUser!.accounts[0].active).toBeFalsy();
  });
});
