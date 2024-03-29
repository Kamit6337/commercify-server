import dotenv from "dotenv";
dotenv.config();

export const environment = {
  PORT: process.env.PORT,
  MONGO_DB_URI: process.env.MONGO_DB_URI,
  CLIENT_URL: process.env.CLIENT_URL,
  CLIENT_CHECKLOGIN_URL: `${process.env.CLIENT_URL}/login/check`,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  SERVER_URL: `http://localhost:${process.env.PORT}`,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_EXPIRES_IN: Number(process.env.JWT_EXPIRES_IN),
  SALT_ROUND: +process.env.SALT_ROUND,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
};
