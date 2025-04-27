import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const config = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  migrationsRun: false,
  logging: true,
  migrations: ["database/migrations/**/*{.ts,.js}"],
  entities: [__dirname + "./../../**/*.entity{.ts,.js}"],
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

config
  .initialize()
  .then(() => {
    console.log("✅ Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("❌ Error during Data Source initialization", err);
  });

export default config;
