import { Injectable } from "@nestjs/common";
import { Readable } from "stream";
import * as fs from "fs";
import * as path from "path";
import IAssetsService from "./assets.interface";

@Injectable()
export class LocalAssetsService implements IAssetsService {
  private readonly basePath: string;

  constructor() {
    this.basePath = path.resolve(__dirname, "../../uploads");
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true });
    }
  }

  async uploadBuffer(
    buffer: Buffer,
    folder: string,
    filename: string,
    _contentType: string
  ): Promise<string | null> {
    const folderPath = path.join(this.basePath, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    const filePath = path.join(folderPath, filename);
    try {
      fs.writeFileSync(filePath, buffer);
      return path.join(folder, filename);
    } catch (error) {
      console.error(`Error uploading file ${filePath}: ${error}`);
      return null;
    }
  }

  async deleteFile(key: string): Promise<void> {
    const filePath = path.join(this.basePath, key);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      console.warn(`File ${filePath} does not exist.`);
    }
  }

  async getFileStream(key: string): Promise<Readable> {
    const filePath = path.join(this.basePath, key);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File ${filePath} does not exist.`);
    }
    return fs.createReadStream(filePath);
  }
}

export default LocalAssetsService;
