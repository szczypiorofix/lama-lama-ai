import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiDetails } from '../shared/models';

@Controller('api')
export class ApiController {
    constructor(private readonly apiService: ApiService) {}

    @Get()
    getApiDetails(): ApiDetails {
        return this.apiService.getApiDetails();
    }
}
