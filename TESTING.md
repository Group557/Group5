# 1. Testing Tools

- Unit tests: Jest
- System tests: Jest + Supabase stack

# 2. Instructions to Install Dependencies/Run Tests

## Unit Tests

    1. cd packages/frontend
    2. npm test

## System Tests

    1. npx supabase start
    2. (Input URL, ANON_KEY, and SERVICE_ROLE_KEY in .env.test)
    3. cd packages/frontend
    4. npx jest --config jest.system.config.js
    5. npx supabase stop

# 3. Testing Levels

## Unit Tests

The unit tests check a singl function without the database or
UI, following the Arrange, Act, Assert pattern. Current unit
tests: 1. username.test.ts: tests a valid username and rejects
if it is not 3-20 characters all lowercase, numbers, . , _ , or
is not unique (already taken)

## System Tests

The system tests verifies a complete feature utilizing multiple
parts of the app, resembling real use. Current system tests: 1.
signout.system.test.ts: a real test user is created, signed in,
and signed out (returning success)

# 4. TDD

# 5. External Services, Env Variables, Seed Data, Test Databases, etc.

Services: - Local Supabase stack (system tests)

Env variables: - SUPABASE_URL - SUPABASE_ANON_KEY -
SUPABSAE_SERVICE_ROLE_KEY

# 6. Known Testing Limitations

    -
