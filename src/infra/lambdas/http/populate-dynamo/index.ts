import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { dynamoClient } from '@/infra/database/dynamo/client'
import { DynamoLeadsRepository } from '@/infra/database/dynamo/repositories/dynamo-leads-repository'
import { PopulateDynamoService } from './service'
import { Response } from '../../shared/response'

export async function handler(_event: APIGatewayProxyEventV2) {
  const leadsRepository = new DynamoLeadsRepository(dynamoClient)

  const { amountOfCreatedLeads } = await new PopulateDynamoService(
    leadsRepository,
  ).execute()

  return Response.okResponse(`Created ${amountOfCreatedLeads} leads`)
}
