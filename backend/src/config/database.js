const path = require("path");
const { Sequelize } = require("sequelize");

// Load .env from the backend root directory
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

console.log("Environment Variables:");
console.log({
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? "******" : undefined,
});

// Check required variables
const requiredEnv = [
  "DB_HOST",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
];

for (const variable of requiredEnv) {
  if (!process.env[variable]) {
    console.error(`❌ Missing environment variable: ${variable}`);
    process.exit(1);
  }
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    logging: process.env.NODE_ENV === 'production' ? false : console.log,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected successfully");

    // Sync all models (alter: true adds new columns without dropping data)
    await sequelize.sync({ alter: true });
    console.log("✅ Models synchronized");
  } catch (error) {
    console.error("❌ PostgreSQL connection error:");
    console.error(error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectDB,
};