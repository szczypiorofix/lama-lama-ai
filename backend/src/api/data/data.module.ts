import { Module } from '@nestjs/common';

import { RagModule } from '../../services';

import { DataController } from './data.controller';
import { DataService } from './data.service';

@Module({
    imports: [RagModule],
    controllers: [DataController],
    providers: [DataService],
})
export class DataModule {}
