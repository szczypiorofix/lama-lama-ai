export interface RagAskResponse {
    answer: string;
}

export interface LlamaResponseChunk {
    model: string;
    created_at: string;
    message: {
        role: string;
        content: string;
    };
    done: boolean;
}

export interface OllamaMessage {
    role: string;
    content: string;
}

export interface OllamaStreamChunk {
    model?: string;
    created_at?: string;
    done?: boolean;
    message: OllamaMessage;
}
