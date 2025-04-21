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
