import request from "supertest";

import { app } from "../../app";
import { authUser } from "@goblit/shared";
import { AuthProviders } from "../../enums/providers.enum";

describe("Authenticated User", () => {
  it("returns authUser null when user is not authenticated", async () => {
    const response = await request(app)
      .get("/api/auth/authuser")
      .send()
      .expect(200);

    expect(JSON.parse((await response.request).text)).toEqual({
      authUser: null,
    });
  });

  it("returns authUser data when user is authenticated", async () => {
    const responseOne = await request(app).post("/api/auth/signup").send({
      provider: AuthProviders.Credentials,
      email: "test@test.com",
      password: "password",
      passwordConfirmation: "password",
    });

    const responseTwo = await request(app)
      .get("/api/auth/authuser")
      .set("Cookie", responseOne.get("Set-Cookie")!)
      .send()
      .expect(200);

    const reqAuthUser = JSON.parse((await responseTwo.request).text);

    expect(reqAuthUser.authUser.id).toEqual(responseOne.body.id);
    expect(reqAuthUser.authUser.email).toEqual(responseOne.body.email);
  });
});
