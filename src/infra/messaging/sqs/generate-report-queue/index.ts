import { env } from '@/config/env'
import { GenerateReportQueue } from '@/domain/messaging/generate-report-queue'
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'

export class GenerateReportSQSQueue implements GenerateReportQueue {
  constructor(private readonly sqsClient: SQSClient) { }

  async publish<T>(payload: T): Promise<void> {
    const cmd = new SendMessageCommand({
      QueueUrl: env.GENERATE_REPORT_QUEUE_URL,
      MessageBody: JSON.stringify(payload),
    })

    await this.sqsClient.send(cmd)
  }
}
