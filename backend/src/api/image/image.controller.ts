import { Controller, Logger } from '@nestjs/common';
import { ImageService } from './image.service';

@Controller('api/image')
export class ImageController {
    private readonly logger = new Logger(ImageController.name);

    constructor(private readonly imageService: ImageService) {}
}
