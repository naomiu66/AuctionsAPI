import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { TelegramUsersService } from './users.telegram.service';
import {
  TelegramUser,
  TelegramUserSchema,
} from './schemas/telegramUser.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: TelegramUser.name, schema: TelegramUserSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, TelegramUsersService],
  exports: [UsersService, TelegramUsersService],
})
export class UsersModule {}
