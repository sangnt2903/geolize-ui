import { IPDetails } from '../../domain/entities/IPDetails';
import { IPLookupRepository } from '../../domain/usecases/IPLookupUseCase';

export class IPLookupRepositoryImpl implements IPLookupRepository {
  async getIPDetails(ip: string): Promise<IPDetails> {
    const apiHost = process.env.REACT_APP_API_HOST;
    const lookupIpEndpoint = process.env.REACT_APP_LOOKUP_IP_ENDPOINT;

    const response = await fetch(`${apiHost}${lookupIpEndpoint}?ips=${ip}`, {
      headers: {
        'accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch IP details');
    }
    const data = await response.json();
    return data.data[0]; // Access the first item in the data array
  }
}

export class IPModifyRepositoryImpl {
  async modifyIPDetails(data: IPDetails): Promise<void> {
    const apiHost = process.env.REACT_APP_API_HOST;
    const modifyIpEndpoint = process.env.REACT_APP_MODIFY_IP_ENDPOINT;

    const response = await fetch(`${apiHost}${modifyIpEndpoint}`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to update IP details');
    }
  }
} 