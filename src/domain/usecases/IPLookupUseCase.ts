import { IPDetails } from '../entities/IPDetails';

export interface IPLookupRepository {
  getIPDetails(ip: string): Promise<IPDetails>;
}

export class IPLookupUseCase {
  constructor(private repository: IPLookupRepository) {}

  async execute(ip: string): Promise<IPDetails> {
    if (!ip) {
      throw new Error('IP address is required');
    }
    return this.repository.getIPDetails(ip);
  }
} 