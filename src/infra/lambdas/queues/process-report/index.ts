import { SQSEvent } from 'aws-lambda'
import { z } from 'zod'
import { parseBody } from '../../shared/validation/body-parser'
import { InvalidPayloadError } from '@/core/errors/invalid-payload-error'
import { ProcessReportService } from './service'

const processReportSchema = z.object({
  userId: z.string({ required_error: 'userId is required' }).min(1),
  filters: z.object(
    {
      confirmed: z.boolean({ required_error: 'confirmed is required' }),
    },
    { required_error: 'filters is required' },
  ),
})

export type ProcessReportPayload = z.infer<typeof processReportSchema>

export async function handler(event: SQSEvent) {
  try {
    const record = event.Records[0]

    parseBody<ProcessReportPayload>(processReportSchema, record.body)

    await new ProcessReportService().execute()
  } catch (err) {
    console.error(err)

    if (err instanceof InvalidPayloadError) {
    }
  }
}
