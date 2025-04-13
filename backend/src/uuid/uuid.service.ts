import { Injectable } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class UuidService {
    public generate(): string {
        return uuidV4();
    }
}
