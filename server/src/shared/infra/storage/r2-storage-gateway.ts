import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import type {
  StorageGateway,
  StorageUploadResult,
  UploadStreamParams,
} from '@/link-management/application/gateways';
import { env } from '@/shared/config/env';

export class R2StorageGateway implements StorageGateway {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadStream(params: UploadStreamParams): Promise<StorageUploadResult> {
    const key = `${params.folder}/${params.fileName}`;

    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: env.CLOUDFLARE_BUCKET_NAME,
        Key: key,
        Body: params.contentStream,
        ContentType: params.contentType,
      },
    });

    await upload.done();

    return {
      url: `${env.CLOUDFLARE_PUBLIC_URL}/${key}`,
    };
  }
}
