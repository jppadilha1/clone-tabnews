import { Client } from "pg";

async function query(clientObject) {
  const client = new Client({
    localhost: process.env.POSTGRES_LOCALHOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });
  await client.connect();
  const result = await client.query(clientObject);
  await client.end();
  return result;
}

export default {
  query: query,
};
