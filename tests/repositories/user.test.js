const {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  changeUser,
} = require("../../src/repositories/userRepository");
const User = require("../../src/models/User").default;
const {
  createUserMissing,
  existingEmailError,
  userNotFound,
} = require("../../src/errors/errorsMessages");
const db = require("../helpers/db");
const argon2 = require("argon2");

beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe("Create user", () => {
  it("creates user correctly", async (done) => {
    const { _id } = await createUser("test@test.com", "test");

    const user = await User.findById(_id);

    expect(user.email).toBe("test@test.com");
    done();
  });

  it("creates user without email", async (done) => {
    try {
      await createUser("", "test");
    } catch (e) {
      expect(e.message).toBe(createUserMissing);
      expect(e.getCode()).toBe(400);
      done();
    }
  });

  it("creates user without password", async (done) => {
    try {
      await createUser("withoutpass@test.com", "");
    } catch (e) {
      expect(e.message).toBe(createUserMissing);
      expect(e.getCode()).toBe(400);
      done();
    }
  });

  it("creates user with existing email", async (done) => {
    try {
      await createUser("test@test.com", "123");
      await createUser("test@test.com", "123");
      done();
    } catch (e) {
      expect(e.message).toBe(existingEmailError);
      expect(e.getCode()).toBe(400);
      done();
    }
  });
});

describe("Get User", () => {
  it("Get all users", async (done) => {
    await createUser("test1@test.com", "123");
    await createUser("test2@test.com", "123");

    const users = await getAllUsers();

    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(2);
    done();
  });

  it("Get user", async (done) => {
    const { _id, email } = await createUser("test@test.com", "123");

    const byId = await getUserById(_id);
    const byEmail = await getUserByEmail(email);

    expect(byId._id).toEqual(_id);
    expect(byEmail._id).toBe(_id);
    done();
  });
});

describe("change User", () => {
  it("Change email correctly", async (done) => {
    const { _id, email } = await createUser("test@test.com", "123");

    await changeUser(_id, { email: "changed@test.com" });

    const user = await getUserById(_id);

    expect(user.email).not.toEqual(email);
    expect(user.email).toBe("changed@test.com");
    done();
  });

  it("Change for not existing id", async (done) => {
    try {
      await changeUser("aaa", { email: "changed@test.com" });
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toEqual(userNotFound);
      expect(e.getCode()).toEqual(404);
      done();
    }
  });

  it("Change to existing email", async (done) => {
    try {
      const { email } = await createUser("test1@test.com", "123");
      const { _id } = await createUser("test2@test.com", "123");
      await changeUser(_id, { email });
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toEqual(existingEmailError);
      expect(e.getCode()).toEqual(400);
      done();
    }
  });

  it("Change password", async (done) => {
    const { _id } = await createUser("test1@test.com", "123");

    const { password } = await changeUser(_id, { password: "321" });

    const bool = await argon2.verify(password, "321");
    expect(bool).toBe(true);
    done();
  });
});

describe("Delete user", () => {
  if ("delete correctly", async (done) => {
    const { _id } = await createUser("test1@test.com", "123");

    await deleteUser(_id);

    const user = await User.findById(_id);

    expect(user).toEqual(null);
    done();
  });
});
