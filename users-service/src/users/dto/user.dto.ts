import { UserDocument } from '../schemas/user.schema';

export class UserDto {
  readonly id!: string;
  readonly username!: string;
  readonly email?: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }

  static fromEntity(user: UserDocument): UserDto {
    return new UserDto({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
