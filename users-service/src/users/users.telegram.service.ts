import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TelegramUser } from './schemas/telegramUser.schema';
import { Model } from 'mongoose';
import { CreateTelegramUserDto } from './dto/create-telegram-user.dto';

@Injectable()
export class TelegramUsersService {
  constructor(
    @InjectModel(TelegramUser.name) private repository: Model<TelegramUser>,
  ) {}

  async create(dto: CreateTelegramUserDto) {
    return await this.repository.create(dto);
  }

  async getById(id: string) {
    return await this.repository.findById(id);
  }

  async getByTelegramId(telegramId: number) {
    return await this.repository.findOne({ telegramId });
  }

  async deleteById(id: string) {
    return await this.repository.findByIdAndDelete(id);
  }

  async deleteByTelegramId(telegramId: number) {
    return await this.repository.deleteOne({ telegramId });
  }
}
