import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateMessageDto {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsInt()
    conversationId: number;

    @IsNotEmpty()
    @IsInt()
    senderId: number;
}