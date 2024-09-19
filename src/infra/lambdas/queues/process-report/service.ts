import { env } from '@/config/env'
import { mbToBytes } from '@/helpers/mb-to-bytes'
import * as DynamoLeadsRepo from '@/infra/database/dynamo/repositories/dynamo-leads-repository'
import { S3MPUManager } from '@/infra/storage/s3/s3-mpu-manager'
import { randomUUID } from 'crypto'
const minChunkize = mbToBytes(6)

export class ProcessReportService {
  async execute() {
    const fileKey = `${new Date().toISOString()}-${randomUUID()}.csv`

    const mpu = new S3MPUManager(env.REPORTS_BUCKET_NAME, fileKey)
    await mpu.start()

    try {
      const header = 'ID,Name,E-mail,Role\n'
      let currentChunk = header

      for await (const {
        Items: leads = [],
      } of DynamoLeadsRepo.getLeadsPaginator()) {
        currentChunk += leads
          .map(
            (lead) =>
              `${lead.id.S}, ${lead.name.S}, ${lead.email.S}, ${lead.jobTitle.S}\n`,
          )
          .join('')

        const currentChunkSize = Buffer.byteLength(currentChunk, 'utf-8')

        if (currentChunkSize < minChunkize) {
          continue
        }

        await mpu.uploadPart(Buffer.from(currentChunk, 'utf-8'))

        currentChunk = ''
      }

      if (currentChunk) {
        await mpu.uploadPart(Buffer.from(currentChunk, 'utf-8'))
      }

      await mpu.complete()
    } catch (err) {
      await mpu.abort()
    }
  }
}
