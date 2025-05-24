import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TtsModel } from '../../entities';

import { TtsModelController } from './tts-model.controller';
import { TtsModelService } from './tts-model.service';

@Module({
    imports: [TypeOrmModule.forFeature([TtsModel])],
    controllers: [TtsModelController],
    providers: [TtsModelService],
})
export class TtsModelModule {}
