import { IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  readonly username!: string;
  @IsString()
  @IsOptional()
  readonly email?: string;
  @IsString()
  readonly password!: string;
}
