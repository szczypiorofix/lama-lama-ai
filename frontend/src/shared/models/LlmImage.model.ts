import { LlmModelPurpose } from '../enums';

export interface LlmImage {
    id: number;
    name: string;
    version: string;
    downloaded: boolean;
    purpose: LlmModelPurpose;
    size: number;
    createdAt: Date | null;
    updatedAi: Date | null;
}

export interface LlmImageDownloadResponse {
    message: string;
    success: boolean;
}
