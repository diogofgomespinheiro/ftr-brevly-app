import type {
  StorageGateway,
  StorageUploadResult,
  UploadStreamParams,
} from '@/link-management/application/gateways';

export class FakeStorageGateway implements StorageGateway {
  public uploadedFiles: UploadStreamParams[] = [];
  public uploadedContent: string[] = [];

  async uploadStream(params: UploadStreamParams): Promise<StorageUploadResult> {
    this.uploadedFiles.push(params);

    const chunks: Buffer[] = [];
    for await (const chunk of params.contentStream) {
      chunks.push(Buffer.from(chunk));
    }
    this.uploadedContent.push(Buffer.concat(chunks).toString('utf-8'));

    return {
      url: `https://fake-storage.test/${params.folder}/${params.fileName}`,
    };
  }
}
