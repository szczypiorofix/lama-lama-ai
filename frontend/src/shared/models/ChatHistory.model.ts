export interface ChatHistory {
    id: number;
    userQuestion: string;
    modelAnswer: string;
    modelName: string;
    createdAt: Date;
}
