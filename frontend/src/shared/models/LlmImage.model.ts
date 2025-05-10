import { LlmModelPurpose } from '../enums';
import { LlmModelImageStatus } from '../enums';

export interface LlmImage {
    id: number;
    name: string;
    version: string;
    downloaded: boolean;
    purpose: LlmModelPurpose;
    size: number;
    status: LlmModelImageStatus;
    createdAt: Date | null;
    updatedAi: Date | null;
}

export interface LlmImageDownloadResponse {
    message: string;
    success: boolean;
}
