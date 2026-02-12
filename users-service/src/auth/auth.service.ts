import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async registerUser(dto: RegisterDto): Promise<string> {
    if (!dto.username || !dto.password)
      throw new BadRequestException('Required fields are not provided');

    const userDto = CreateUserDto.fromRegisterDto(dto);

    const user = await this.usersService.create(userDto);

    return user._id.toString();
  }

  async validateUser(dto: LoginDto): Promise<string> {
    if (!dto.email && !dto.username)
      throw new BadRequestException('Required credentials are not provided');

    let user: UserDocument;
    if (dto.email) user = await this.usersService.getByEmail(dto.email);
    else if (dto.username)
      user = await this.usersService.getByUsername(dto.username);
    else {
      throw new UnauthorizedException();
    }

    const validatePassword = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!validatePassword)
      throw new UnauthorizedException('Invalid credentials');

    return user._id.toString();
  }
}
