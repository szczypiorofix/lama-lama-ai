import { Controller, Logger, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ImageService } from './image.service';

@Controller('api/image')
export class ImageController {
    private readonly logger = new Logger(ImageController.name);

    constructor(private readonly imageService: ImageService) {}

    @Post('analyze')
    @UseInterceptors(FileInterceptor('file'))
    async sendFileMultiple(@UploadedFile() file: Express.Multer.File) {
        this.logger.log(`Received ${file.originalname} file (${Math.floor(file.size / 1024).toString()} kb).`);
        const response: string = await this.imageService.analyzeImage(file);
        return {
            message: response,
            fileName: '',
            code: 200,
        };
    }
}
