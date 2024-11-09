import request from "supertest";

import { app } from "../../app";
import { AuthProviders } from "../../enums/providers.enum";
import { User } from "../../models/user.model";
import { MailAdapter } from "../../adapters/mail.adapter";
import { mailService } from "../../services/mail.service";

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

describe("Auth Signup [With Credentials]", () => {
  it("returns a 400 response when email is not valid", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({
        provider: AuthProviders.Credentials,
        email: "",
        password: "password",
        passwordConfirmation: "password",
      })
      .expect(400);

    await request(app)
      .post("/api/auth/signup")
      .send({
        provider: AuthProviders.Credentials,
        email: "test@test",
        password: "password",
        passwordConfirmation: "password",
      })
      .expect(400);

    await request(app)
      .post("/api/auth/signup")
      .send({
        provider: AuthProviders.Email,
        email: "test@test",
      })
      .expect(400);
  });

  it("returns a 400 when passwords are not valid", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({
        provider: AuthProviders.Credentials,
        email: "test@test.com",
        password: "123",
        passwordConfirmation: "password",
      })
      .expect(400);

    await request(app)
      .post("/api/auth/signup")
      .send({
        provider: AuthProviders.Credentials,
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

    await request(app).post("/api/auth/signup").send({
      provider: AuthProviders.Credentials,
      email: "test@test.com",
      password: "password",
      passwordConfirmation: "password",
    });
  });

  it("returns a 201 reponse when user successfuly register and set a cookie", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        provider: AuthProviders.Credentials,
        email: "test@test.com",
        password: "password",
        passwordConfirmation: "password",
      })
      .expect(201);

    expect(response.body.email).toEqual("test@test.com");
    expect(response.get("Set-Cookie")).toBeDefined();
  });
});

describe("Auth Signup [With Email]", () => {
  it("returns a 400 response when email is not valid", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({
        provider: AuthProviders.Email,
        email: "test@test",
      })
      .expect(400);
  });

  it("creates a new user and set an access token and expiration", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({
        provider: AuthProviders.Email,
        email: "test@test.com",
      })
      .expect(200);

    const user = await User.findOne({
      email: "test@test.com",
    });

    expect(user).toBeDefined();
    expect(user!.accounts.length).toEqual(1);
    expect(user!.accounts[0].provider).toEqual(AuthProviders.Email);
    expect(user!.accounts[0].accessToken).toBeDefined();
    expect(user!.accounts[0].expires).toBeDefined();
  });

  it("creates a new account for an existant user and set an access token and expiration", async () => {
    const user = await User.build({
      provider: AuthProviders.Credentials,
      email: "test@test.com",
      password: "password",
    });
    await user.save();

    await request(app).post("/api/auth/signup").send({
      provider: AuthProviders.Email,
      email: "test@test.com",
    });

    const updatedUser = await User.findOne({
      email: "test@test.com",
    });

    expect(updatedUser!.accounts.length).toEqual(2);
    expect(updatedUser!.accounts[1].provider).toEqual(AuthProviders.Email);
    expect(updatedUser!.accounts[1].accessToken).toBeDefined();
    expect(updatedUser!.accounts[1].expires).toBeDefined();
  });

  it("update the access token and expiration of an existant user", async () => {
    await request(app).post("/api/auth/signup").send({
      provider: AuthProviders.Email,
      email: "test@test.com",
    });

    const user = await User.findOne({
      email: "test@test.com",
    });

    // Get some sleep
    await sleep(1500);

    await request(app).post("/api/auth/signup").send({
      provider: AuthProviders.Email,
      email: "test@test.com",
    });

    const updatedUser = await User.findOne({
      email: "test@test.com",
    });

    expect(updatedUser!.accounts.length).toEqual(1);
    expect(updatedUser!.accounts[0].accessToken).not.toEqual(
      user!.accounts[0].accessToken
    );
    expect(updatedUser!.accounts[0].expires).not.toEqual(
      user!.accounts[0].expires
    );
  });

  if (MailAdapter.isActive()) {
    it("calls the email send function and returns a 200 response", async () => {
      await request(app)
        .post("/api/auth/signup")
        .send({
          provider: AuthProviders.Email,
          email: "test@test.com",
        })
        .expect(200);

      expect(mailService.send).toHaveBeenCalled();
    });
  }
});
