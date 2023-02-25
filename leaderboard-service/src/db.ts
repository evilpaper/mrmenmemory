import postgres from "postgres";

const host = process.env.DB_HOST;
const port = Number(process.env.DB_PORT);
const database = process.env.DB_DATABASE;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const sql = postgres({
  host: host,
  port: port,
  database: database,
  username: username,
  password: password,
});

export default sql;
