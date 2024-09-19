import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { PopulateDynamoService } from './service'
import { Response } from '../../shared/response'

export async function handler(_event: APIGatewayProxyEventV2) {
  const { amountOfCreatedLeads } = await new PopulateDynamoService().execute()

  return Response.okResponse(`Created ${amountOfCreatedLeads} leads`)
}
