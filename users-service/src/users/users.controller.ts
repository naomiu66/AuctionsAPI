import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.create(userDto);
  }

  @Get()
  getAll() {
    return this.usersService.getAll();
  }

  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.usersService.getById(id);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
