import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async createUser(payload: {
    name: string;
    email: string;
    passwordHash: string;
    role?: 'user' | 'admin';
  }) {
    return this.userModel.create({
      ...payload,
      email: payload.email.toLowerCase().trim(),
      role: payload.role ?? 'user',
    });
  }

  async getSafeProfile(userId: string) {
    const user = await this.findById(userId);
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.findById(userId);
    if (dto.name) user.name = dto.name;
    await user.save();
    return this.getSafeProfile(userId);
  }
}
