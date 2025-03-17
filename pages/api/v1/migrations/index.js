import { up } from "infra/migrations/1741263889271_test-migration";
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const dbClientInstance = await database.getNewClient();

  const defaultMigrationsOptions = {
    dbClient: dbClientInstance,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(defaultMigrationsOptions);
    await dbClientInstance.end();
    return response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun: false,
    });

    await dbClientInstance.end();

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }
    return response.status(200).json(migratedMigrations);
  }

  await dbClientInstance.end();
  return response.status(405).end();
}
