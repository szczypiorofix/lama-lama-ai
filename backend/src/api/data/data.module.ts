import { Module } from '@nestjs/common';

import { ChromaModule } from '../../services/chroma/chroma.module';

import { DataController } from './data.controller';
import { DataService } from './data.service';

@Module({
    imports: [ChromaModule],
    controllers: [DataController],
    providers: [DataService],
})
export class DataModule {}
