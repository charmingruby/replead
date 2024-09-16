import { Lead } from '@/domain/entity/lead'
import { AttributeValue } from '@aws-sdk/client-dynamodb'

type DynamoLead = {
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
    return {
      id: dynamoLead.id.S,
      name: dynamoLead.name.S,
      email: dynamoLead.email.S,
      jobTitle: dynamoLead.jobTitle.S,
    }
  }
}
