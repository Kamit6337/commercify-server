import { isDatabaseConnected } from "../server.js";
import HandleGlobalError from "../utils/HandleGlobalError.js";

const databaseConnection = (req, res, next) => {
  if (!isDatabaseConnected) {
    return next(new HandleGlobalError("Sorry, databse is not connected", 404));
  }

  next();
};

export default databaseConnection;
