import * as crypto from "crypto";

export interface EncryptedData {
  securityKey: string;
  encryptedData: string;
}

class Encryption {
  constructor() {}

  private algorithm = process.env.ALGORITHM_KEY;
  private key: Buffer = Buffer.from(process.env.SECRET_KEY, "hex");
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

  async decrypt(data: EncryptedData): Promise<string> {
    const { securityKey, encryptedData } = data;

    try {
      const iv = Buffer.from(securityKey, "hex");

      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
      let decrypted = decipher.update(encryptedData, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error) {
      console.error("Decryption error:", error.message);
      throw new Error(
        "Failed to decrypt data. Check the encryption parameters.",
      );
    }
  }
}

export default Encryption;
