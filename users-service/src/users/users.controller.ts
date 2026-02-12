import {
  Body,
  Controller,
  // Delete,
  Get,
  Param,
  UseGuards,
  // Post,
  // Put,
} from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
// import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { SessionUser } from 'src/auth/decorators/current-user.decorator';
import { SessionAuthGuard } from 'src/auth/guards/session.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // @Post()
  // async create(@Body() userDto: CreateUserDto): Promise<UserDto> {
  //   const response = await this.usersService.create(userDto);
  //   return UserDto.fromEntity(response);
  // }
  @UseGuards(SessionAuthGuard)
  @Get('profile')
  async getMe(@SessionUser() userId: string): Promise<UserDto> {
    const response = await this.usersService.getById(userId);
    return UserDto.fromEntity(response);
  }

  @Get()
  async getAll(): Promise<UserDto[]> {
    const response = await this.usersService.getAll();
    return response.map((user) => UserDto.fromEntity(user));
  }

  @Get('/:id')
  async getById(@Param('id') id: string): Promise<UserDto> {
    const response = await this.usersService.getById(id);
    return UserDto.fromEntity(response);
  }

  // @Put('/:id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() dto: UpdateUserDto,
  // ): Promise<UserDto> {
  //   const response = await this.usersService.update(id, dto);
  //   return UserDto.fromEntity(response);
  // }

  // @Delete('/:id')
  // async delete(@Param('id') id: string): Promise<UserDto> {
  //   const response = await this.usersService.delete(id);
  //   return UserDto.fromEntity(response);
  // }
}
