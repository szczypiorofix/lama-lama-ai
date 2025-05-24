import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatHistoryEntity } from '../../entities';

import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';

@Module({
    imports: [TypeOrmModule.forFeature([ChatHistoryEntity])],
    controllers: [HistoryController],
    providers: [HistoryService],
    exports: [HistoryService],
})
export class HistoryModule {}
