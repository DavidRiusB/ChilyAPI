import { IsNotEmpty, IsString, IsInt } from "class-validator";

export class CreateMessageDto {
  @IsNotEmpty()
  @IsInt()
  orderId: number;

  @IsNotEmpty()
  @IsString()
  description: string;
}
