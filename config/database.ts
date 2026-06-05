/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-anonymous-default-export */
import path from "path";

export default ({ env }: { env: any }): any => {
  const isProduction = env("NODE_ENV") === "production";

  return {
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
      pool: isProduction
        ? {
            min: env.int("DATABASE_POOL_MIN", 2),
            max: env.int("DATABASE_POOL_MAX", 10),
          }
        : undefined,
    },
  };
};
