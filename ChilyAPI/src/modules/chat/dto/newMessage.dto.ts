import { IsNumber, IsString } from "class-validator";

export class NewMessageDto {
  @IsString()
  text: string;

  @IsNumber()
  userId: number;

  @IsNumber()
  chatLogId: number;
}
