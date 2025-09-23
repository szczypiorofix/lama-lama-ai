import { Controller, Get, Param } from '@nestjs/common';

import { TtsModelService } from './tts-model.service';

@Controller('api/tts-models')
export class TtsModelController {
    constructor(private readonly modelService: TtsModelService) {}

    @Get()
    public async list() {
        return this.modelService.findAll();
    }

    @Get(':voiceId')
    public async getByVoiceId(@Param('voiceId') voiceId: string) {
        return this.modelService.findByVoiceId(voiceId);
    }
}
