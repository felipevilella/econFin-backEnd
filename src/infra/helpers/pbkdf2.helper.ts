import * as crypto from "crypto";

export interface IHashPassword {
  hash: string;
  salt: string;
}

class Pbkdf2Helper {
  constructor() {}

  private options = {
    iterations: 100000,
    keyLength: 64,
    digest: "sha512",
  };

  generateSalt() {
    return crypto.randomBytes(16);
  }

  async hashPassword(password: string): Promise<IHashPassword> {
    const salt = this.generateSalt();
    const hash = await new Promise<Buffer>((resolve, reject) => {
      crypto.pbkdf2(
        password,
        salt,
        this.options.iterations,
        this.options.keyLength,
        this.options.digest,
        (err, derivedKey) => {
          if (err) reject(err);
          resolve(derivedKey);
        },
      );
    });

    return {
      hash: hash.toString("base64"),
      salt: salt.toString("base64"),
    };
  }

  async validatePassword(
    password: string,
    storedHash: string,
    storedSalt: string,
  ): Promise<boolean> {
    const saltBuffer = Buffer.from(storedSalt, "base64");
    const storedHashBuffer = Buffer.from(storedHash, "base64");

    const hashToCompare = await new Promise<Buffer>((resolve, reject) => {
      crypto.pbkdf2(
        password,
        saltBuffer,
        this.options.iterations,
        this.options.keyLength,
        this.options.digest,
        (err, derivedKey) => {
          if (err) reject(err);
          resolve(derivedKey);
        },
      );
    });

    return storedHashBuffer.equals(hashToCompare);
  }
}

export default Pbkdf2Helper;
