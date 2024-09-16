import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { randomUUID } from 'node:crypto'
import { faker } from '@faker-js/faker'
import { PutItemCommand } from '@aws-sdk/client-dynamodb'
import { dynamoClient } from '@/infra/database/dynamo/client'
import { env } from '@/config/env'
import { DynamoLeadsMapper } from '@/infra/database/dynamo/mappers/dynamo-leads-mapper'
import { Lead } from '@/domain/entity/lead'
import { Response } from '../shared/response'

export async function handler(_event: APIGatewayProxyEventV2) {
  const totalAmountOfLeads = 100

  const responses = await Promise.allSettled(
    Array.from({ length: totalAmountOfLeads }, async () => {
      const lead: Lead = {
        id: randomUUID(),
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        jobTitle: faker.person.jobTitle(),
      }

      const cmd = new PutItemCommand({
        TableName: env.DYNAMO_LEADS_TABLE,
        Item: DynamoLeadsMapper.toDynamo(lead),
      })

      await dynamoClient.send(cmd)
    }),
  )

  const totalCreatedLeads = responses.filter(
    (result) => result.status === 'fulfilled',
  ).length

  return Response.okResponse(`Created ${totalCreatedLeads} leads`)
}
