import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import bcrypt from 'node_modules/bcryptjs';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { email, password, username } = createUserDto;
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        throw new BadRequestException('User with this email already exist');
      }
      const hashePassword = await bcrypt.hash(password, 7);
      const createUser = new this.userModel({
        email,
        password: hashePassword,
        username,
        favoriteRecipes: [],
      });
      return await createUser.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unexpected error occurred');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ email }).exec();
      if (!user) {
        throw new NotFoundException(`Recipe with email ${email} not found`);
      }
      return user;
    } catch (error) {
      console.error('Error in findbyemail ', error);
      return null;
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}
