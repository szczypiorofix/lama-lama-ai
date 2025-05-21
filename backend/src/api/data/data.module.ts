import { Module } from '@nestjs/common';
import { DataController } from './data.controller';
import { DataService } from './data.service';
import { RagModule } from '../../services/rag/rag.module';

@Module({
    imports: [RagModule],
    controllers: [DataController],
    providers: [DataService],
})
export class DataModule {}
