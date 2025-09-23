import { Controller, Logger, Post } from '@nestjs/common';

import { ChatHistoryEntity } from '../../entities';

import { HistoryService } from './history.service';

@Controller('api/history')
export class HistoryController {
    private readonly logger = new Logger(HistoryController.name);

    constructor(private readonly historyService: HistoryService) {}

    @Post('save')
    public async sendFileMultiple(userQuestion: string, modelAnswer: string): Promise<ChatHistoryEntity> {
        return this.historyService.saveChatMessage(userQuestion, modelAnswer, modelAnswer);
    }
}
