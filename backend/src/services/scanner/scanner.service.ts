import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

import { ProcessedFile } from '../../entities';
import { RagService } from '../';

@Injectable()
export class ScannerService {
    private isProcessing = false;
    private readonly folderPath = '../training_data/';
    private readonly logger = new Logger(ScannerService.name);
    private readonly MAX_BYTES_PER_RUN = 256 * 1024; // 256 KB

    constructor(
        private readonly ragService: RagService,
        @InjectRepository(ProcessedFile)
        private readonly processedFileRepo: Repository<ProcessedFile>,
    ) {
        this.logger.log('ScannerService initialized!');
    }

    @Cron('*/60 * * * * *')
    public async handleCron() {
        if (this.isProcessing) {
            this.logger.log('Scanning is already in progress.');
            return;
        }

        let reachLimit = false;
        try {
            this.logger.log('Scanning for new files in folder: ' + this.folderPath);
            const files: string[] = fs.readdirSync(this.folderPath);
            let totalBytes: number = 0;
            let filesLeft: number = files.length;

            for (const file of files) {
                if (!file.endsWith('.txt')) {
                    continue;
                }

                const alreadyProcessed = await this.processedFileRepo.findOneBy({ filename: file });
                if (alreadyProcessed) {
                    continue;
                }

                this.isProcessing = true;

                const filePath = path.join(this.folderPath, file);
                const stats = fs.statSync(filePath);
                const fileSize = stats.size;

                if (totalBytes + fileSize > this.MAX_BYTES_PER_RUN) {
                    this.logger.log(
                        `Reached limit ${this.MAX_BYTES_PER_RUN} bytes. Skipping file ${file}. Files left: ${filesLeft}`,
                    );
                    reachLimit = true;
                    break;
                }

                const content = fs.readFileSync(filePath, 'utf-8');
                try {
                    this.logger.log('Processing ' + file);
                    await this.ragService.addDocument(content, file);

                    fs.unlinkSync(filePath);

                    await this.processedFileRepo.save({
                        filename: file,
                        size: fileSize,
                    });

                    totalBytes += fileSize;
                    filesLeft--;
                } catch (err) {
                    this.logger.error(`An error occurred while reading file ${file}:`, err);
                }
            }
        } finally {
            if (this.isProcessing && !reachLimit) {
                this.logger.log('All files processed.');
            }
            this.isProcessing = false;
        }
    }
}
