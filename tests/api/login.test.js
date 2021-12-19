process.env.PORT = 3002;

const supertest = require("supertest");
const mongoose = require("mongoose");
const { getDataFromToken } = require("../../src/helpers/jwt");
const { server } = require("../../src/index");

const api = supertest(server);

const {
  invalidCredentials,
  createUserMissing,
} = require("../../src/errors/errorsMessages");

let user1Data = { email: "test1@test.com", password: "123" };
let user2Data = { email: "test1@test.com", password: "321" };

let user1;
let user2;

beforeAll(async (done) => {
  const res1 = await api.post("/users").send(user1Data);
  const res2 = await api.post("/users").send(user2Data);

  user1 = res1.body;
  user2 = res2.body;
  done();
});

afterAll((done) => {
  mongoose.connection.close();
  server.close(done);
});

describe("Login user", () => {
  it("login correctly and refresh", async (done) => {
    let res = await api.post("/token").send(user1Data);

    expect(res.body).toHaveProperty("token");

    let tokenData = getDataFromToken(res.body.token);

    expect(tokenData.email).toEqual(user1Data.email);

    res = await api.post("/token").set("Cookie", [res.headers["set-cookie"]]);

    expect(res.body).toHaveProperty("token");

    tokenData = getDataFromToken(res.body.token);

    expect(tokenData.email).toEqual(user1Data.email);
    done();
  });

  it("login incorrectly", async (done) => {
    let res = await api
      .post("/token")
      .send({ email: "aaaaa", password: "bbbbb" });

    expect(res.body).not.toHaveProperty("token");
    expect(res.body.error).toEqual(invalidCredentials);

    res = await api.post("/token").send({ password: "bbbbb" });

    expect(res.body).not.toHaveProperty("token");
    expect(res.body.error).toEqual(createUserMissing);

    res = await api.post("/token").send({ email: "aaaaa" });

    expect(res.body).not.toHaveProperty("token");
    expect(res.body.error).toEqual(createUserMissing);
    done();
  });
});
