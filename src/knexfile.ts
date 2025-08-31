import type { Knex } from "knex";
import { config } from "./db/env.js";

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: config.database.host,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database,
      port: config.database.port,
    },
    migrations: {
      directory: "./migrations",
      extension: "ts",
    },
  },
};

export default knexConfig;
