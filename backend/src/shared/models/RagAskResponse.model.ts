export interface OllamaMessage {
    role: string;
    content: string;
}

export interface OllamaChatStreamChunk {
    model?: string;
    created_at?: string;
    done?: boolean;
    message: OllamaMessage;
}

export interface OllamaStreamResponse {
    message: string;
    type: 'answer' | 'sources';
    sources: string[];
}

export interface OllamaLlavaStreamChunk {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
    done_reason?: string;
    context?: number[];
    total_duration?: number;
    load_duration?: number;
    prompt_eval_count?: number;
    eval_count?: number;
    eval_duration?: number;
}
