import * as crypto from "crypto";

export interface EncryptedData {
  securityKey: string;
  encryptedData: string;
}

class Encryption {
  constructor() {}

  private algorithm = `${process.env.ALGORITHM_KEY}`;
  private key: Buffer = crypto.randomBytes(32);
  private securityKey: Buffer = crypto.randomBytes(16);

  async encrypt(text: string): Promise<EncryptedData> {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.key,
      this.securityKey,
    );
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return {
      securityKey: this.securityKey.toString("hex"),
      encryptedData: encrypted,
    };
  }

  async decrypt(encryptedData: EncryptedData): Promise<string> {
    const { securityKey, encryptedData: data } = encryptedData;

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(securityKey, "hex"),
    );
    let decrypted = decipher.update(data, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }
}

export default Encryption;
