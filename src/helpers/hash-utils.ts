import { createHmac, randomBytes, scrypt } from "crypto";
import { promisify } from "util";

const asyncFunc = promisify(scrypt);

export class HashUtils {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const buf = (await asyncFunc(password, salt, 64)) as Buffer;

    return `${buf.toString("hex")}.${salt}`;
  }

  static async verify(storedPassword: string, password: string) {
    const [hash, salt] = storedPassword.split(".");
    const buf = (await asyncFunc(password, salt, 64)) as Buffer;

    return buf.toString("hex") === hash;
  }

  static tokenHash(token: string) {
    return createHmac("sha256", process.env.REFRESH_SECRET_KEY!)
      .update(token)
      .digest("hex");
  }
}
