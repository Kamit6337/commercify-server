import crypto from "crypto";
import { environment } from "../environment.js";

// Generate secret hash with crypto to use for encryption
const key = crypto
  .createHash("sha512")
  .update(environment.ENCRYPTION_SECRET_KEY)
  .digest("hex")
  .substring(0, 32);

const encryptionIV = crypto
  .createHash("sha512")
  .update(environment.ENCRYPTION_SECRET_IV)
  .digest("hex")
  .substring(0, 16);

function decrypt(encryptedData) {
  const buff = Buffer.from(encryptedData, "base64");
  const decipher = crypto.createDecipheriv(
    environment.ECNRYPTION_METHOD,
    key,
    encryptionIV
  );
  return JSON.parse(
    decipher.update(buff.toString("utf8"), "hex", "utf8") +
      decipher.final("utf8")
  ); // Decrypts data and converts to utf8
}

export default decrypt;
