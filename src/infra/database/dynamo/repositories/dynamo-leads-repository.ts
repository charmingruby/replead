import { env } from '@/config/env'
import { Lead } from '@/domain/entities/lead'
import { LeadsRepository } from '@/domain/repositories/leads-repository'
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { DynamoLeadsMapper } from '../mappers/dynamo-leads-mapper'
import { dynamoClient } from '../client'

export class DynamoLeadsRepository implements LeadsRepository {
  constructor(private readonly dynamoClient: DynamoDBClient) { }

  async store(lead: Lead): Promise<void> {
    const cmd = new PutItemCommand({
      TableName: env.DYNAMO_LEADS_TABLE,
      Item: DynamoLeadsMapper.toDynamo(lead),
    })

    await dynamoClient.send(cmd)
  }
}
