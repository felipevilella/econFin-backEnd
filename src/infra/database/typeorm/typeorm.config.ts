import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const config = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  migrationsRun: process.env.DATABASE_MIGRATIONS === "true",
  logging: process.env.DATABASE_LOGGING === "true",
  synchronize: false,
  migrations: ["database/migrations/**/*{.ts,.js}"],
  entities: [__dirname + "./../../**/*.entity{.ts,.js}"],
  ssl: { rejectUnauthorized: false },
});

console.log(process.env);

config
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

export default config;
