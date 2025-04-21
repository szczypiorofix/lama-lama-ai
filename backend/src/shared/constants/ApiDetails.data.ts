import { API_VERSION } from './Config.data';
import { ApiDetails } from '../models';

export const apiDetails: ApiDetails = {
    name: 'Local Lama API Service',
    path: `/${API_VERSION}/api`,
    version: '0.0.1',
};
