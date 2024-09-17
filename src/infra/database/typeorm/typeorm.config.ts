
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();
const config = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  migrationsRun: process.env.DATABASE_MIGRATIONS === 'true',
  logging: process.env.DATABASE_LOGGING === 'true',
  synchronize: true,
  migrations: ['database/migrations/**/*{.ts,.js}'],
  entities: [__dirname + './../../**/*.entity{.ts,.js}'],
});

config
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
export default config;
