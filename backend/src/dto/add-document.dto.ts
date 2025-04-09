import { IsArray, IsString } from 'class-validator';

export class AddDocumentListDto {
    @IsArray()
    list: AddDocumentDto[];
}

export class AddDocumentDto {
    @IsString()
    id: string;

    @IsString()
    text: string;
}
