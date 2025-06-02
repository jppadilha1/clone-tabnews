import retry from "async-retry";
import database from "infra/database";

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(testConnection, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function testConnection() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
};

export default orchestrator;
