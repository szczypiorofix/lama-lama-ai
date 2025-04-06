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
