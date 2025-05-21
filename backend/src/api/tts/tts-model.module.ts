import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TtsModelService } from './tts-model.service';
import { TtsModelController } from './tts-model.controller';
import { TtsModel } from '../../entities';

@Module({
    imports: [TypeOrmModule.forFeature([TtsModel])],
    controllers: [TtsModelController],
    providers: [TtsModelService],
    exports: [TtsModelService],
})
export class TtsModule {}
