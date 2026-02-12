import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

// TODO: add cache here
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userRepository: Model<User>) {}

  async create(dto: CreateUserDto): Promise<UserDocument> {
    const exists = await this.userRepository.findOne({
      $or: [{ email: dto.email }, { username: dto.username }],
    });

    if (exists)
      throw new ConflictException('User with these credentials already exists');

    let passwordHash: string | undefined;
    if (dto.password) {
      passwordHash = await bcrypt.hash(dto.password, 10);
    }

    const user = await this.userRepository.create({
      username: dto.username,
      email: dto.email,
      passwordHash,
    });

    return user;
  }

  async getAll(): Promise<UserDocument[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async getById(id: string): Promise<UserDocument> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  async getByEmail(email: string): Promise<UserDocument> {
    const user = await this.userRepository.findOne({ email });
    if (!user) throw new NotFoundException();
    return user;
  }

  async getByUsername(username: string): Promise<UserDocument> {
    const user = await this.userRepository.findOne({ username });
    if (!user) throw new NotFoundException();
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    const user = await this.userRepository.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });

    if (!user) throw new NotFoundException();

    return user;
  }

  async delete(id: string): Promise<UserDocument> {
    const user = await this.userRepository.findByIdAndDelete(id);
    if (!user) throw new NotFoundException();
    return user;
  }
}
