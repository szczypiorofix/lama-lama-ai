import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ChromaService {
    private readonly logger = new Logger(ChromaService.name);

    constructor() {}
}
