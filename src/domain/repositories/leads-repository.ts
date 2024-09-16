import { Lead } from '../entities/lead'

export interface LeadsRepository {
  store(lead: Lead): Promise<void>
}
