import { Injectable } from "@nestjs/common";
import IAssetsService from "../assets.interface";
import { Readable } from "stream";

@Injectable()
export class MockAssetsService implements IAssetsService {
  uploadBuffer(
    _buffer: Buffer,
    folder: string,
    filename: string,
    _contentType: string
  ): Promise<string | null> {
    return Promise.resolve(`${folder}/${filename}`);
  }

  deleteFile(_key: string): Promise<void> {
    return;
  }

  getFileStream(_key: string): Promise<Readable> {
    throw new Error("Method not implemented.");
  }
}
