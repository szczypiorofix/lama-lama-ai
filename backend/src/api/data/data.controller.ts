import { Body, Controller, Logger, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DataService } from './data.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/data')
export class DataController {
    private readonly logger = new Logger(DataController.name);

    constructor(private readonly dataService: DataService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    public async sendFileMultiple(@UploadedFile() file: Express.Multer.File, @Body('documentId') documentId: string) {
        this.logger.log(
            `Received ${file.originalname} file (${Math.floor(file.size / 1024).toString()} kb) with documentId: ${documentId}.`,
        );
        await this.dataService.putDataFileIntoDatabase(file, documentId);
        return {
            message: `File ${file.originalname} uploaded successfully.`,
            fileName: '',
            code: 200,
        };
    }
}
