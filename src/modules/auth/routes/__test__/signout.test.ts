import request from "supertest";

import { app } from "../../../../app";
import { User } from "../../../../models/user";

describe("Auth - Signout test", () => {
  it("returns an empty session when user signout and delete the refresh token associated", async () => {
    const initial = await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);

    let user = await User.findById(initial.body.id);
    expect(user!.tokens.length).toEqual(1);

    const response = await request(app)
      .post("/api/users/signout")
      .set("Cookie", initial.get("Set-Cookie")!)
      .send()
      .expect(200);

    expect(response.get("Set-Cookie")![0]).toEqual(
      "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
    );

    user = await User.findById(initial.body.id);
    expect(user!.tokens.length).toEqual(0);
  });
});
