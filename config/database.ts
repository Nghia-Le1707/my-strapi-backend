/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "path";
import type { Core } from "@strapi/strapi";

const config = ({
  env,
}: Core.Config.Shared.ConfigParams): Core.Config.Database => {
  const isProduction = env("NODE_ENV") === "production";

  const dbConfig: any = {
    connection: {
      client: isProduction ? "postgres" : "sqlite",
      connection: isProduction
        ? {
            connectionString: env("DATABASE_URL"),
            ssl: { rejectUnauthorized: false },
          }
        : {
            filename: path.join(
              __dirname,
              "..",
              "..",
              env("DATABASE_FILENAME", ".tmp/data.db"),
            ),
          },
      useNullAsDefault: !isProduction,
      acquireConnectionTimeout: env.int("DATABASE_CONNECTION_TIMEOUT", 60000),
    },
  };

  if (isProduction) {
    dbConfig.connection.pool = {
      min: env.int("DATABASE_POOL_MIN", 2),
      max: env.int("DATABASE_POOL_MAX", 10),
    };
  }

  return dbConfig;
};

export default config;
