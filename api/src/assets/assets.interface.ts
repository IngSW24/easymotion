import { Readable } from "stream";

export const ASSETS_SERVICE = "ASSETS_SERVICE";
export default interface IAssetsService {
  uploadBuffer(
    buffer: Buffer,
    folder: string,
    filename: string,
    contentType: string
  ): Promise<string | null>;
  deleteFile(key: string): Promise<void>;
  getFileStream(key: string): Promise<Readable>;
}
