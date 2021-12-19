const supertest = require("supertest");
const { server } = require("../../src/index");
const mongoose = require("mongoose");
const api = supertest(server);

const { existingEmailError, createUserMissing, forbidden } = require("../../src/errors/errorsMessages");

afterAll((done) => {
  mongoose.connection.close();
  server.close(done);
});

describe("POST Paths", () => {
  it("POST /users correct", async (done) => {
    const res = await api
      .post("/users")
      .send({ email: "test@test.com", password: "123" });

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toEqual("test@test.com");
    done();
  });

  it("POST /users incorrectly", async (done) => {
    let res = await api
      .post("/users")
      .send({ email: "test@test.com", password: "123" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toEqual(existingEmailError);

    res = await api
      .post("/users")
      .send({ password: "123" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toEqual(createUserMissing);

    res = await api
      .post("/users")
      .send({ email: "test@test.com" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toEqual(createUserMissing);
    done();
  });
});

describe("GET Paths", () => {
  let user;

  it("GET /users", async (done) => {
    const res = await api.get("/users");

    user = res.body[0];

    expect(res.status).toBe(200);
    expect(res.body.length).toEqual(1);
    done();
  });

  it("GET /users/:id", async (done) => {
    const res = await api.get(`/users/${user.id}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toEqual(user.id);
    done();
  });
});

describe("PUT and DELETE Path", () => {
  let user1Token;
  let user2Token;

  let user2;

  beforeAll(async(done) => {
    let res = await api
      .post("/users")
      .send({ email: "test2@test.com", password: "123" });
    user2 = res.body;

    res = await api.post("/token").send({ email: "test@test.com", password: "123" });
    user1Token = res.body.token;

    res = await api.post("/token").send({ email: "test2@test.com", password: "123" });
    user2Token = res.body.token;

    done();
  });

  it("correct PUT /:id path", async(done) => {
    let res = await api
      .put(`/users/${user2.id}`)
      .send({ email: "test2@test.com", password: "321" })
      .set('Authorization',`Bearer ${user2Token}`);

    expect(res.body.email).not.toEqual(user2.email);

    res = await api.post("/token").send({ email: "test2@test.com", password: "321" });
    expect(res.body).toHaveProperty("token");
    done();
  });

  it("incorrect PUT /:id path", async(done) => {
    let res = await api
      .put(`/users/${user2.id}`)
      .send({ email: "test2@test.com", password: "321" })
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.body.error).toEqual(forbidden);
    expect(res.statusCode).toEqual(403);

    done();
  });

  it("incorrect DELETE /:id path", async(done) => {
    let res = await api
      .delete(`/users/${user2.id}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.body.error).toEqual(forbidden);
    expect(res.statusCode).toEqual(403);

    done();
  });

  it("correct DELETE /:id path", async(done) => {
    let res = await api
      .delete(`/users/${user2.id}`)
      .set('Authorization', `Bearer ${user2Token}`);

    res = await api.get("/users");
    expect(res.body.length).toBe(1);
    done();
  });
});