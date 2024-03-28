import { environment } from "../environment.js";
import jwt from "jsonwebtoken";

const generateWebToken = (
  obj,
  {
    secret = environment.JWT_SECRET_KEY,
    expires = environment.JWT_EXPIRES_IN,
  } = {}
) => {
  return jwt.sign({ ...obj, expire: Date.now() + expires }, secret, {
    expiresIn: expires,
  });
};

export default generateWebToken;
