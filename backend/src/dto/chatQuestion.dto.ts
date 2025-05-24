import { IsBoolean, IsString } from 'class-validator';

export class ChatQuestionDto {
    @IsString()
    question: string;

    @IsString()
    selectedModel: string;

    @IsBoolean()
    strictAnswer: boolean;

    @IsBoolean()
    useContextOnly: boolean;
}
