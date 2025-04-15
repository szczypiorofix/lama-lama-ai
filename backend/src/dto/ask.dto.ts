import { IsBoolean, IsString } from 'class-validator';

export class AskDto {
    @IsString()
    question: string;

    @IsBoolean()
    strictanswer: boolean;

    @IsBoolean()
    usecontextonly: boolean;
}
