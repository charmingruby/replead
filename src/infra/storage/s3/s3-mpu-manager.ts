import {
  AbortMultipartUploadCommand,
  CompletedPart,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
} from '@aws-sdk/client-s3'
import { s3Client } from './client'

export class S3MPUManager {
  private uploadId: string | undefined

  private partNumber = 1
  private uploadParts: CompletedPart[] = []

  constructor(
    private readonly bucketName: string,
    private readonly fileKey: string,
  ) { }

  async start() {
    const cmd = new CreateMultipartUploadCommand({
      Bucket: this.bucketName,
      Key: this.fileKey,
    })

    const { UploadId } = await s3Client.send(cmd)
    if (!UploadId) {
      throw new Error('Failed creating Multipart upload')
    }

    this.uploadId = UploadId
  }

  async uploadPart(body: Buffer) {
    const cmd = new UploadPartCommand({
      Bucket: this.bucketName,
      Key: this.fileKey,
      PartNumber: this.partNumber,
      UploadId: this.uploadId,
      Body: body,
    })

    const { ETag } = await s3Client.send(cmd)

    this.uploadParts.push({
      ETag,
      PartNumber: this.partNumber,
    })
    this.partNumber++
  }

  async complete() {
    const cmd = new CompleteMultipartUploadCommand({
      Bucket: this.bucketName,
      Key: this.fileKey,
      UploadId: this.uploadId,
      MultipartUpload: {
        Parts: this.uploadParts,
      },
    })

    this.partNumber++

    await s3Client.send(cmd)
  }

  async abort() {
    const cmd = new AbortMultipartUploadCommand({
      Bucket: this.bucketName,
      Key: this.fileKey,
      UploadId: this.uploadId,
    })

    await s3Client.send(cmd)
  }
}
