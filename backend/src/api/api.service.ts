import { Injectable } from '@nestjs/common';
import { apiServiceDetails } from '../shared/constants';

@Injectable()
export class ApiService {
    getHello(): string {
        return JSON.stringify(apiServiceDetails);
    }
}
