import { Controller, Logger } from '@nestjs/common';

import { UtilsService } from './utils.service';

@Controller('api/utils')
export class UtilsController {
    private readonly logger = new Logger(UtilsController.name);

    constructor(private readonly utilsService: UtilsService) {}
}
