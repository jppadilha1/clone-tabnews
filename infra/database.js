import { Client } from "pg";
import { ServiceError } from "./errors.js";

async function query(clientObject) {
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(clientObject);
    return result;
  } catch (err) {
    const publicServiceError = new ServiceError({
      message: "Erro de conexão com o banco ou na query",
      cause: err,
    });
    throw publicServiceError;
  } finally {
    await client?.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_LOCALHOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};

export default database;

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return process.env.POSTGRES_CA;
  }
  return process.env.NODE_ENV === "production" ? true : false;
}
