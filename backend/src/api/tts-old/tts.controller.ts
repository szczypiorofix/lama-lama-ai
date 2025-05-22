import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { TtsService } from './tts.service';

@Controller('api/tts')
export class TtsController {
    constructor(private readonly ttsService: TtsService) {}

    @Post()
    public async synthesize(@Body('text') text: string, @Res() res: Response) {
        await this.ttsService.synthesize(text, res);
    }
}
