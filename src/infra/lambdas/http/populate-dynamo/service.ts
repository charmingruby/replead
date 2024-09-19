import { Lead } from '@/domain/entities/lead'
import { faker } from '@faker-js/faker'
import * as DynamoLeadsRepo from '@/infra/database/dynamo/repositories/dynamo-leads-repository'

export class PopulateDynamoService {
  async execute() {
    const totalAmountOfLeads = 100

    const responses = await Promise.allSettled(
      Array.from({ length: totalAmountOfLeads }, async () => {
        const lead = new Lead({
          name: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
          jobTitle: faker.person.jobTitle(),
        })

        await DynamoLeadsRepo.createLead(lead)
      }),
    )

    const amountOfCreatedLeads = responses.filter(
      (result) => result.status === 'fulfilled',
    ).length

    return {
      amountOfCreatedLeads,
    }
  }
}
