import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatHistoryEntity } from '../../orm/chat-history.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ChatHistoryEntity])],
    controllers: [HistoryController],
    providers: [HistoryService],
})
export class HistoryModule {}
