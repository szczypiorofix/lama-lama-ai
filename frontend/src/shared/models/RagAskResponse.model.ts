export interface RagAskResponse {
    answer: string;
}

export interface OllamaStreamResponse {
    message: string;
    type: 'answer' | 'sources';
    sources: string[];
}
