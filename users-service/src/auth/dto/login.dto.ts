import { IsEmail, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  readonly username?: string;
  @IsString()
  @IsOptional()
  @IsEmail()
  readonly email?: string;
  @IsString()
  readonly password!: string;
}
