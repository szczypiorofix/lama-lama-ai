import { IsBoolean, IsString } from 'class-validator';

export class AskDto {
    @IsString()
    question: string;

    @IsString()
    selectedModel: string;

    @IsBoolean()
    strictAnswer: boolean;

    @IsBoolean()
    useContextOnly: boolean;
}
