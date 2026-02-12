import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TelegramUserDocument = HydratedDocument<TelegramUser>;

@Schema({ timestamps: true })
export class TelegramUser {
  @Prop({ unique: true, required: true })
  telegramId!: number;

  @Prop()
  username?: string;

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;
}

export const TelegramUserSchema = SchemaFactory.createForClass(TelegramUser);
