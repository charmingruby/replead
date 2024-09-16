import { Response } from '@/infra/lambdas/shared/response'
import { APIGatewayProxyEventV2 } from 'aws-lambda'

export async function handler(_event: APIGatewayProxyEventV2) {
  return Response.okResponse('Hello, world!')
}
