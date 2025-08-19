import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument, UserRole } from './schema/user.schema';
import bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/createUser.dto';
import { CreateAdminDto } from './dto/create.admin.dto.';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async createUser(
    createUserDto: CreateUserDto | CreateAdminDto,
  ): Promise<UserDocument> {
    const { email, password, username } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 7);

    const role = (createUserDto as CreateAdminDto).role || UserRole.USER;

    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      username,
      role,
      favoriteRecipes: [],
    });

    return newUser.save();
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    try {
      return this.userModel.findOne({ username }).exec();
    } catch (error) {
      console.error('Error in findbyusername ', error);
      return null;
    }
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    try {
      return await this.userModel.findOne({ email }).exec();
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

  async addToFavorite(userId: string, recipeId: string) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not foun');
      }

      if (user.favoriteRecipes.includes(new Types.ObjectId(recipeId))) {
        user.favoriteRecipes.push(new Types.ObjectId(recipeId));
        await user.save();
      }

      return user;
    } catch (error) {
      console.error('Error in addToUserFavorite', error);
    }
  }

  async deleteFromFavorite(userId: string, recipeId: string) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not foun');
      }
      user.favoriteRecipes = user.favoriteRecipes.filter(
        (fav) => fav.toString() !== recipeId,
      );

      await user.save();
      return user;
    } catch (error) {
      console.error('Error in deleteFavorite', error);
    }
  }
}
