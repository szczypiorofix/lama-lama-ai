import { Module } from '@nestjs/common';
import { DataController } from './data.controller';
import { DataService } from './data.service';
import { RagModule } from '../../rag/rag.module';
import { UuidModule } from '../../uuid/uuid.module';

@Module({
    imports: [RagModule, UuidModule],
    controllers: [DataController],
    providers: [DataService],
})
export class DataModule {}
