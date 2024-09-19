import { env } from '@/config/env'
import { Lead } from '@/domain/entities/lead'
import { paginateScan, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { dynamoClient } from '../client'
import { DynamoLeadsMapper } from '../mappers/dynamo-leads-mapper'

async function createLead(lead: Lead) {
  const cmd = new PutItemCommand({
    TableName: env.DYNAMO_LEADS_TABLE,
    Item: DynamoLeadsMapper.toDynamo(lead),
  })

  await dynamoClient.send(cmd)
}

function getLeadsPaginator() {
  return paginateScan(
    { client: this.dynamoClient },
    { TableName: env.DYNAMO_LEADS_TABLE },
  )
}

export { createLead, getLeadsPaginator }
