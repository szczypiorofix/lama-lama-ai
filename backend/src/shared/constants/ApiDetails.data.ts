import { ApiDetails } from '../models';

import { API_VERSION } from './Config.data';

export const apiDetails: ApiDetails = {
    name: 'Local Lama API Service',
    path: `/${API_VERSION}/api`,
    version: '0.0.1',
};
