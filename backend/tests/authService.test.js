const test = require('node:test');
const assert = require('node:assert/strict');
const { signupService, loginService } = require('../services/authService');
const dbModule = require('../db');

test('authService tests with mock user collection', async (t) => {
  const users = [];

  // Mock userCollection
  const mockCollection = {
    findOne: async (query) => {
      if (query.email) {
        return users.find((u) => u.email === query.email) || null;
      }
      return null;
    },
    insertOne: async (doc) => {
      const inserted = { ...doc, _id: 'mock_id_' + (users.length + 1) };
      users.push(inserted);
      return { insertedId: inserted._id };
    },
  };

  // Mock getDb
  const originalGetDb = dbModule.getDb;
  dbModule.getDb = () => ({
    collection: (name) => {
      if (name === 'user') return mockCollection;
      throw new Error(`Unexpected collection: ${name}`);
    },
  });

  t.after(() => {
    dbModule.getDb = originalGetDb;
  });

  // 1. Signup succeeds
  const newUser = await signupService({
    name: 'Test User',
    email: 'TEST@example.com',
    password: 'password123',
    role: 'donor',
  });

  assert.equal(newUser.name, 'Test User');
  assert.equal(newUser.email, 'test@example.com');
  assert.equal(newUser.role, 'donor');
  assert.equal(newUser.password, undefined, 'Password should not be returned');
  assert.ok(newUser._id);

  // 2. Duplicate signup fails
  await assert.rejects(
    () =>
      signupService({
        name: 'Another User',
        email: 'test@example.com',
        password: 'pass',
        role: 'receiver',
      }),
    /User already exists with this email/
  );

  // 3. Login succeeds with correct credentials
  const loggedInUser = await loginService({
    email: 'test@example.com',
    password: 'password123',
  });

  assert.equal(loggedInUser.email, 'test@example.com');
  assert.equal(loggedInUser.password, undefined, 'Password should not be returned');

  // 4. Login fails with wrong password
  await assert.rejects(
    () =>
      loginService({
        email: 'test@example.com',
        password: 'wrongpassword',
      }),
    /Invalid email or password/
  );

  // 5. Login fails with non-existent user
  await assert.rejects(
    () =>
      loginService({
        email: 'nobody@example.com',
        password: 'password123',
      }),
    /Invalid email or password/
  );
});
