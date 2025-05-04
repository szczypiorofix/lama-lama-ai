import { Controller, Logger, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { DataService } from './data.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('api/data')
export class DataController {
    private readonly logger = new Logger(DataController.name);

    constructor(private readonly dataService: DataService) {}

    @Post('upload')
    @UseInterceptors(FilesInterceptor('files'))
    public async sendFileMultiple(@UploadedFiles() files: Express.Multer.File[]) {
        this.logger.log(`Received ${files.length} files(s).`);
        for (const file of files) {
            this.logger.log(`Received ${file.originalname} file (${Math.floor(file.size / 1024).toString()} kb).`);
            await this.dataService.putDataFileIntoDatabase(file);
        }
        return {
            message: `Files (${files.length} total) uploaded successfully.`,
            fileName: '',
            code: 200,
        };
    }
}
