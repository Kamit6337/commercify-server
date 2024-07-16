import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { corsOptions } from "../utils/corsOptions.js";
import session from "express-session";
import expressSessionOptions from "../utils/expressSessionOptions.js";
// import databaseConnection from "./checkDatabaseConnection.js";

const globalMiddlewares = (app) => {
  // app.use(databaseConnection);

  app.use(cors(corsOptions));

  app.use(session(expressSessionOptions));

  // Middleware to parse incoming body
  app.use(bodyParser.json());

  // Middleware to parse JSON request bodies
  app.use(express.json());

  // Middleware to parse URL-encoded request bodies (optional)
  app.use(express.urlencoded({ extended: true }));

  return app;
};

export default globalMiddlewares;
