import { isDatabaseConnected } from "../index.js";
import HandleGlobalError from "../utils/HandleGlobalError.js";

const databaseConnection = (req, res, next) => {
  if (!isDatabaseConnected) {
    return next(new HandleGlobalError("Sorry, database is not connected", 404));
  }

  next();
};

export default databaseConnection;
