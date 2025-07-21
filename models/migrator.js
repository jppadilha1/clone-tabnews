import database from "infra/database";
import { resolve } from "node:path";
import migrationRunner from "node-pg-migrate";
import { MigrationServiceError } from "infra/errors.js";

const defaultMigrationsOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  let dbClientInstance;
  try {
    dbClientInstance = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient: dbClientInstance,
    });

    return pendingMigrations;
  } catch (error) {
    const publicMigrationError = new MigrationServiceError({ cause: error });
    throw publicMigrationError;
  } finally {
    await dbClientInstance?.end();
  }
}

async function runPendingMigrations() {
  let dbClientInstance;
  try {
    dbClientInstance = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient: dbClientInstance,
      dryRun: false,
    });

    return migratedMigrations;
  } catch (error) {
    const publicMigrationError = new MigrationServiceError({ cause: error });
    throw publicMigrationError;
  } finally {
    await dbClientInstance?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
