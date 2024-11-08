import request from "supertest";

import { app } from "../../../../app";
import { User } from "../../../../models/user";
import { AuthProviders } from "../../../../enums/providers";
import { mailService } from "../../../../services/mail-service";
import { MailAdapter } from "../../../../adapters/mail";

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

describe("Email Auth - Signin tests", () => {
  it("returns a 400 response when email is invalid", async () => {
    await request(app).post("/api/auth/email/signin").send().expect(400);

    await request(app)
      .post("/api/auth/email/signin")
      .send({
        email: "test@test",
      })
      .expect(400);
  });

  it("creates a new user and set an access token and expiration", async () => {
    await request(app).post("/api/auth/email/signin").send({
      email: "test@test.com",
    });

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

    await request(app).post("/api/auth/email/signin").send({
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
    await request(app).post("/api/auth/email/signin").send({
      email: "test@test.com",
    });

    const user = await User.findOne({
      email: "test@test.com",
    });

    // Get some sleep
    await sleep(1500);

    await request(app).post("/api/auth/email/signin").send({
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
        .post("/api/auth/email/signin")
        .send({
          email: "test@test.com",
        })
        .expect(200);

      expect(mailService.send).toHaveBeenCalled();
    });
  }
});
