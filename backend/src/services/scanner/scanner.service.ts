import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { promises as fs } from 'fs';
import * as path from 'path';

import { ProcessedFile } from '../../entities';
import { RagService } from '../rag/rag.service';

@Injectable()
export class ScannerService {
    private readonly logger: Logger = new Logger(ScannerService.name);
    private isProcessing: boolean = false;
    private readonly folderPath: string;
    private readonly MAX_BYTES_PER_RUN: number;

    constructor(
        private readonly ragService: RagService,
        private configService: ConfigService,
        @InjectRepository(ProcessedFile)
        private readonly processedFileRepo: Repository<ProcessedFile>,
    ) {
        this.folderPath = this.configService.get<string>('TRAINING_DATA_PATH', '../training_data/');
        this.MAX_BYTES_PER_RUN = this.configService.get<number>('SCANNER_MAX_BYTES_PER_RUN', 256 * 1024);
    }

    @Cron(CronExpression.EVERY_MINUTE)
    public async handleCron() {
        if (this.isProcessing) {
            this.logger.log('Scanning is already in progress.');
            return;
        }

        this.isProcessing = true;
        this.logger.log(`Scanning for new files in folder: ${this.folderPath}`);

        try {
            const newFiles = await this.getNewFiles();
            if (newFiles.length === 0) {
                this.logger.log('No new files to process.');
                return;
            }

            let totalBytesProcessed = 0;

            for (const file of newFiles) {
                const filePath = path.join(this.folderPath, file);
                const stats = await fs.stat(filePath);
                const fileSize = stats.size;

                if (totalBytesProcessed + fileSize > this.MAX_BYTES_PER_RUN) {
                    this.logger.log(
                        `Reached limit of ${this.MAX_BYTES_PER_RUN} bytes. Remaining files will be processed in the next run.`,
                    );
                    break;
                }

                await this.processFile(file, filePath, fileSize);
                totalBytesProcessed += fileSize;
            }

            this.logger.log(`Processing finished. Total bytes processed: ${totalBytesProcessed}.`);
        } catch (error) {
            const e: Error = error as Error;
            const errorStack: string | undefined = e.stack;
            this.logger.error('An error occurred during the scanning process.', errorStack);
        } finally {
            this.isProcessing = false;
        }
    }

    private async getNewFiles(): Promise<string[]> {
        const allFiles = await fs.readdir(this.folderPath);

        const processed = await this.processedFileRepo.find({ select: ['filename'] });
        const processedFilenames = new Set(processed.map((p) => p.filename));

        return allFiles.filter((file) => file.endsWith('.txt') && !processedFilenames.has(file));
    }

    private async processFile(filename: string, filePath: string, fileSize: number): Promise<void> {
        this.logger.log(`Processing file: ${filename} (${fileSize} bytes)`);
        try {
            const content = await fs.readFile(filePath, 'utf-8');

            await this.ragService.addDocument(content, filename);

            await this.processedFileRepo.save({
                filename: filename,
                size: fileSize,
            });

            await fs.unlink(filePath);

            this.logger.log(`Successfully processed and removed file: ${filename}`);
        } catch (err) {
            this.logger.error(`Failed to process file ${filename}:`, err);
        }
    }
}
