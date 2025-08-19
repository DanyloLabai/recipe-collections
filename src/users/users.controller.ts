import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
  InternalServerErrorException,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './schema/user.schema';
import { UserDocument } from './schema/user.schema';
import { Request as ExpressRequest } from 'express';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('favorites/:recipeId')
  async addFavorite(
    @Request() req: ExpressRequest & { user: UserDocument },
    @Param('recipeId') recipeId: string,
  ) {
    const user = req.user;

    if (!user?._id || !user.role) {
      throw new InternalServerErrorException('Invalid user data');
    }

    let userId: string;

    if (user._id instanceof Types.ObjectId) {
      userId = user._id.toHexString();
    } else if (typeof user._id === 'string') {
      userId = user._id;
    } else {
      throw new InternalServerErrorException('Invalid user ID');
    }

    return await this.userService.addToFavorite(userId, recipeId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('favorites/:recipeId')
  async removeFavorite(
    @Request() req: ExpressRequest & { user: UserDocument },
    @Param('recipeId') recipeId: string,
  ) {
    const user = req.user;

    if (!user?._id) {
      throw new InternalServerErrorException('Inva;id user data');
    }

    let userId: string;
    if (user._id instanceof Types.ObjectId) {
      userId = user._id.toHexString();
    } else if (typeof user._id === 'string') {
      userId = user._id;
    } else {
      throw new InternalServerErrorException('Invalid user ID');
    }

    return await this.userService.deleteFromFavorite(userId, recipeId);
  }
}
