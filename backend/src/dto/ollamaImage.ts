import { IsString } from 'class-validator';

export class OllamaImageDto {
    @IsString()
    name: string;
}
