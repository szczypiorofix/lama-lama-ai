import { Controller, Logger, Post } from '@nestjs/common';
import { HistoryService } from './history.service';
import { ChatHistoryEntity } from '../../orm';

@Controller('api/history')
export class HistoryController {
    private readonly logger = new Logger(HistoryController.name);

    constructor(private readonly historyService: HistoryService) {}

    @Post('save')
    public async sendFileMultiple(userQuestion: string, modelAnswer: string): Promise<ChatHistoryEntity> {
        this.logger.log('Received question: ', userQuestion);
        this.logger.log('Received answer: ', modelAnswer);

        return await this.historyService.saveChatMessage(userQuestion, modelAnswer);
    }
}
