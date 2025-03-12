import database from "infra/database";
import jestConfig from "jest.config";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

test("POST to api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response.status).toBe(201);

  const responseBody = await response.json();
  const countMigrationsResult = await database.query(
    "SELECT count(*)::int FROM pgmigrations",
  );
  const countMigrationsValue = countMigrationsResult.rows[0].count;

  expect(Array.isArray(responseBody)).toBe(true);

  expect(responseBody.length).toEqual(countMigrationsValue);

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response2.status).toBe(200);

  const response2Body = await response2.json();

  expect(Array.isArray(response2Body)).toBe(true);
  expect(response2Body.length).toEqual(0);
});
