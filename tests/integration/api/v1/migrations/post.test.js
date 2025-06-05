import database from "infra/database";
// eslint-disable-next-line no-unused-vars
import jestConfig from "jest.config";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("POST api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("Running for the first time", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response.status).toBe(201);

        const responseBody = await response.json();
        const countMigrationsResult = await database.query(
          "SELECT count(*)::int FROM pgmigrations",
        );
        const countMigrationsValue = countMigrationsResult.rows[0].count;

        expect(Array.isArray(responseBody)).toBe(true);

        expect(responseBody.length).toEqual(countMigrationsValue);
      });

      test("Running for the second time", async () => {
        const response2 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response2.status).toBe(200);

        const response2Body = await response2.json();

        expect(Array.isArray(response2Body)).toBe(true);
        expect(response2Body.length).toEqual(0);
      });
    });
  });
});
