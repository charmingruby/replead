import { Lead } from '@/domain/entities/lead'
import { DynamoLeadsRepository } from '@/infra/database/dynamo/repositories/dynamo-leads-repository'
import { faker } from '@faker-js/faker'

export class PopulateDynamoService {
  constructor(private readonly leadsRepository: DynamoLeadsRepository) { }

  async execute() {
    const totalAmountOfLeads = 100

    const responses = await Promise.allSettled(
      Array.from({ length: totalAmountOfLeads }, async () => {
        const lead = new Lead({
          name: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
          jobTitle: faker.person.jobTitle(),
        })

        await this.leadsRepository.store(lead)
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
