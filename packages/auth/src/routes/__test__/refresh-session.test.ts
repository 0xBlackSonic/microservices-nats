import request from "supertest";

import { app } from "../../app";
import { generateSession } from "../../test/utils";
import { AuthProviders } from "../../enums/providers.enum";
import { User } from "../../models/user.model";
import { HashUtils } from "../../helpers/hash.utils";
import { jwtUtils } from "@goblit/shared";

describe("Auth Refresh Session", () => {
  it("returns a 401 response when request session is not valid", async () => {
    const sessionData = generateSession();
    let base64 = Buffer.from(JSON.stringify({ jwt: sessionData.jwt })).toString(
      "base64"
    );
    let cookie = [`session=${base64}`];

    await request(app)
      .post("/api/auth/refresh")
      .set("Cookie", cookie)
      .send()
      .expect(401);

    base64 = Buffer.from(
      JSON.stringify({ refresh: sessionData.refresh })
    ).toString("base64");
    cookie = [`session=${base64}`];

    await request(app)
      .post("/api/auth/refresh")
      .set("Cookie", cookie)
      .send()
      .expect(401);
  });

  it("returns a 401 response when refresh token is expired", async () => {
    const sessionData = generateSession();
    let base64 = Buffer.from(JSON.stringify(sessionData)).toString("base64");
    let cookie = [`session=${base64}`];

    await request(app)
      .post("/api/auth/refresh")
      .set("Cookie", cookie)
      .send()
      .expect(401);
  });

  it("returns a 200 response and a new jwt token when refresh token is not expired", async () => {
    const user = await User.build({
      provider: AuthProviders.Credentials,
      email: "test@test.com",
      password: "password",
    });

    const sessionData = generateSession(
      user.get("_id").toHexString(),
      "0s",
      "1m"
    );
    let base64 = Buffer.from(JSON.stringify(sessionData)).toString("base64");
    let cookie = [`session=${base64}`];

    user.sessions.push({
      sessionToken: HashUtils.tokenHash(sessionData.refresh),
      expires: jwtUtils.getExpirationTime(sessionData.refresh)!,
    });

    await user.save();

    const response = await request(app)
      .post("/api/auth/refresh")
      .set("Cookie", cookie)
      .send()
      .expect(200);

    const newCookie = response.get("Set-Cookie");

    expect(newCookie![0]).not.toEqual(cookie![0]);
  });
});
