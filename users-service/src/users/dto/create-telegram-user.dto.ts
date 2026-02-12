import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTelegramUserDto {
  @IsNumber()
  readonly telegramId!: number;
  @IsString()
  @IsOptional()
  readonly username?: string;
  @IsString()
  @IsOptional()
  readonly firstName?: string;
  @IsString()
  @IsOptional()
  readonly lastName?: string;
}
