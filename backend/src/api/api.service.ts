import { Injectable } from '@nestjs/common';

import { apiDetails } from '../shared/constants';
import { ApiDetails } from '../shared/models';

@Injectable()
export class ApiService {
    /**
     * Get the API details. Basic information about the API.
     *
     * @returns ApiDetails - API details such as name, path and version
     */
    public getApiDetails(): ApiDetails {
        return apiDetails;
    }
}
