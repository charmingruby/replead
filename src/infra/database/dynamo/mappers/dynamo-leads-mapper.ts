import { Lead } from '@/domain/entities/lead'
import { AttributeValue } from '@aws-sdk/client-dynamodb'

export type DynamoLead = {
  id: AttributeValue
  name: AttributeValue
  email: AttributeValue
  jobTitle: AttributeValue
}

export class DynamoLeadsMapper {
  static toDynamo(lead: Lead): DynamoLead {
    return {
      id: { S: lead.id },
      name: { S: lead.name },
      email: { S: lead.email },
      jobTitle: { S: lead.jobTitle },
    }
  }

  static toDomain(dynamoLead: DynamoLead): Lead {
    const lead = new Lead({
      name: dynamoLead.name.S,
      email: dynamoLead.email.S,
      jobTitle: dynamoLead.jobTitle.S,
    })
    lead.id = dynamoLead.id.S

    return lead
  }
}
