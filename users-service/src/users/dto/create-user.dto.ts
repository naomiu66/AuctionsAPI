import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { RegisterDto } from 'src/auth/dto/register.dto';
export class CreateUserDto {
  @IsString()
  @MinLength(3)
  readonly username!: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @IsString()
  @MinLength(6)
  password!: string;

  constructor(partial: Partial<CreateUserDto>) {
    Object.assign(this, partial);
  }

  static fromRegisterDto(dto: RegisterDto): CreateUserDto {
    return new CreateUserDto({
      username: dto.username,
      email: dto.email,
      password: dto.password,
    });
  }
}
