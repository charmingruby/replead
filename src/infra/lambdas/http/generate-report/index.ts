import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { z } from 'zod'
import { InvalidPayloadError } from '@/core/errors/invalid-payload-error'
import { GenerateReportService } from './service'
import { sqsClient } from '@/infra/messaging/sqs/client'
import { GenerateReportSQSQueue } from '@/infra/messaging/sqs/generate-report-queue'
import { parseBody } from '../../shared/validation/body-parser'
import { Response } from '../../shared/response'

const generateReportSchema = z.object({
  userId: z.string({ required_error: 'userId is required' }).min(1),
  filters: z.object(
    {
      confirmed: z.boolean({ required_error: 'confirmed is required' }),
    },
    { required_error: 'filters is required' },
  ),
})

export type GenerateReportPayload = z.infer<typeof generateReportSchema>

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const payload = parseBody<GenerateReportPayload>(
      generateReportSchema,
      event.body,
    )

    const generateReportQueue = new GenerateReportSQSQueue(sqsClient)

    await new GenerateReportService(generateReportQueue).execute(payload)

    return Response.okResponse(
      "The report is being generated. You'll receive an email when it is ready",
    )
  } catch (err) {
    console.error(err)

    if (err instanceof InvalidPayloadError) {
      return Response.badRequestErrorResponse(err.message)
    }

    return Response.internalServerError()
  }
}
