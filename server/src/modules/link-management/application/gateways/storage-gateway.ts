import type { Readable } from 'node:stream';

export interface UploadStreamParams {
  contentStream: Readable;
  contentType: string;
  folder: string;
  fileName: string;
}

export interface StorageUploadResult {
  url: string;
}

export interface StorageGateway {
  uploadStream(params: UploadStreamParams): Promise<StorageUploadResult>;
}
