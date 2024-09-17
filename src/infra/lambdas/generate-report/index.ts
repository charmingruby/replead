import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { z } from 'zod'
import { parseBody } from '../shared/validation/body-parser'
import { InvalidPayloadError } from '@/core/errors/invalid-payload-error'
import { Response } from '../shared/response'

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

    return Response.okResponse('Payload parsed', payload)
  } catch (err) {
    console.error(err)

    if (err instanceof InvalidPayloadError) {
      return Response.badRequestErrorResponse(err.message)
    }

    return Response.internalServerError()
  }
}
