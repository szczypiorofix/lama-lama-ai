import { Controller, Get } from '@nestjs/common';

import { ApiDetails } from '../shared/models';

import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
    constructor(private readonly apiService: ApiService) {}

    @Get()
    getApiDetails(): ApiDetails {
        return this.apiService.getApiDetails();
    }
}
