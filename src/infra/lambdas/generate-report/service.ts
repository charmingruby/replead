import { env } from '@/config/env'
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import { GenerateReportPayload } from '.'

export class GenerateReportService {
  constructor(private readonly sqsClient: SQSClient) { }

  async execute(payload: GenerateReportPayload) {
    const cmd = new SendMessageCommand({
      QueueUrl: env.GENERATE_REPORT_QUEUE_URL,
      MessageBody: JSON.stringify(payload),
    })

    await this.sqsClient.send(cmd)
  }
}
