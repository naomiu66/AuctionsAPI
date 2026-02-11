import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userRepository: Model<User>) {}

  async create(dto: CreateUserDto) {
    if (dto.email) {
      const exists = await this.userRepository.findOne({ email: dto.email });
      if (exists)
        throw new ConflictException(
          'User with these credentials already exists',
        );
    }

    if (dto.telegramId) {
      const exists = await this.userRepository.findOne({
        telegramId: dto.telegramId,
      });
      if (exists) throw new ConflictException('Telegram user already exists');
    }

    let passwordHash: string | undefined;
    if (dto.password) {
      passwordHash = await bcrypt.hash(dto.password, 10);
    }

    return await this.userRepository.create({
      username: dto.username,
      email: dto.email,
      passwordHash,
      telegramId: dto.telegramId,
      telegramUsername: dto.telegramUsername,
    });
  }

  async getAll() {
    return await this.userRepository.find();
  }

  async getById(id: string) {
    return await this.userRepository.findById(id);
  }

  async getByEmail(email: string) {
    return await this.userRepository.findOne({ email });
  }

  async update(id: string, dto: UpdateUserDto) {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    return await this.userRepository.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string) {
    return await this.userRepository.findByIdAndDelete(id);
  }
}
