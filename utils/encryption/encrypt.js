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

// Encryption function
function encrypt(obj) {
  const cipher = crypto.createCipheriv(
    environment.ECNRYPTION_METHOD,
    key,
    encryptionIV
  );
  return Buffer.from(
    cipher.update(JSON.stringify(obj), "utf8", "hex") + cipher.final("hex")
  ).toString("base64"); // Encrypts data and converts to hex and base64
}

export default encrypt;
