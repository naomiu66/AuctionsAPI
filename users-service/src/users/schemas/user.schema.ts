import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, sparse: true })
  telegramId?: number;

  @Prop()
  telegramUsername?: string;

  @Prop()
  username!: string;

  @Prop({ unique: true, sparse: true })
  email?: string;

  @Prop()
  passwordHash!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
