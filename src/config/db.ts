import { Sequelize, Model, DataType } from "sequelize";

const database = process.env.POSTGRES_DB as string
const username = process.env.POSTGRES_USER as string
const password = process.env.POSTGRES_PASSWORD as string

export const sequelize = new Sequelize(database, username, password, {
  host: process.env.POSTGRES_HOST as string || 'db',
  port: 5432,
  dialect: 'postgres',
});

export const connectDB = async () => {
    console.log('Checking database connection...');
    try {
      await sequelize.authenticate();
      console.log('Database connection established');
      await sequelize.sync({alter: true})
    } catch (e) {
      console.log('Database connection failed', e);
      process.exit(1);
    }
  };