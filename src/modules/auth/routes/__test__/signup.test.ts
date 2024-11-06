import request from "supertest";

import { app } from "../../../../app";
import { User } from "../../../../models/user";

describe("Auth - Signup tests", () => {
  it("returns a 400 response when email is invalid", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .send({
        email: "",
        password: "password",
      })
      .expect(400);

    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test",
        password: "password",
      })
      .expect(400);
  });

  it("returns a 400 response when password is invalid", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "1234",
      })
      .expect(400);
  });

  it("returns a 400 response when user already exist", async () => {
    const user = User.build({
      email: "test@test.com",
      password: "password",
    });
    await user.save();

    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(400);
  });

  it("returns a 201 reponse when user successfuly register and set a cookie", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);

    expect(response.body.email).toEqual("test@test.com");
    expect(response.get("Set-Cookie")).toBeDefined();
  });
});
