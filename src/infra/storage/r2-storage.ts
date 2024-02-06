import { randomUUID } from 'node:crypto'

import { Eraser } from '@/domain/application/storage/eraser'
import { UploadParams, Uploader } from '@/domain/application/storage/uploader'
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

import { env } from '../env'

export class R2Storage implements Uploader, Eraser {
  private client: S3Client

  constructor() {
    const accountId = env.CLOUDFLARE_ACCOUNT_ID

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    })
  }

  async upload(params: UploadParams): Promise<{ url: string }> {
    const { fileName, fileType, body } = params

    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    )

    return {
      url: uniqueFileName,
    }
  }

  async delete(fileName: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: fileName,
      }),
    )
  }
}
