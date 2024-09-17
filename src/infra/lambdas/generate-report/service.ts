import { GenerateReportQueue } from '@/domain/messaging/generate-report-queue'
import { GenerateReportPayload } from '.'

export class GenerateReportService {
  constructor(private readonly generateReportQueue: GenerateReportQueue) { }

  async execute(payload: GenerateReportPayload) {
    await this.generateReportQueue.publish<GenerateReportPayload>(payload)
  }
}
