export interface LlmImageList {
    models: LlmImage[];
}

export interface LlmImageDetails {
    parent_model: string;
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
}

export interface LlmImage {
    name: string;
    model: string;
    modified_at: string;
    size: number;
    digest: string;
    details: LlmImageDetails;
}

export interface LlmImageDownloadResponse {
    message: string;
    success: boolean;
}

export interface PullingImageModel {
    status: string;
    digest?: string;
    total?: number;
    completed?: number;
}
