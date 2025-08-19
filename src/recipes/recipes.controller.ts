import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  InternalServerErrorException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Request as ExpressRequest } from 'express';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDocument, UserRole } from 'src/users/schema/user.schema';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async submitRecipe(
    @Body() creteRcipeDto: CreateRecipeDto,
    @Request() req: ExpressRequest & { user: UserDocument },
  ) {
    try {
      const user = req.user;

      if (!user?._id || !user.role) {
        throw new InternalServerErrorException('Invalid user data');
      }
      const isAdmin = req.user.role === UserRole.ADMIN;
      let userId: string;

      if (user._id instanceof Types.ObjectId) {
        userId = user._id.toHexString();
      } else if (typeof user._id === 'string') {
        userId = user._id;
      } else {
        throw new InternalServerErrorException('Invalid user ID');
      }
      const recipe = await this.recipesService.create(
        creteRcipeDto,
        userId,
        isAdmin,
      );
      return {
        message: isAdmin ? 'Recipe added' : 'Recipe submitted for approval',
        recipe,
      };
    } catch (error) {
      console.error('Error in submitRecipe', error);
      throw new InternalServerErrorException('Could not submit recipe');
    }
  }
  @Get()
  findAll() {
    return this.recipesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteRecipe(
    @Param('id') id: string,
    @Request() req: ExpressRequest & { user: UserDocument },
  ) {
    await this.recipesService.remove(id, req.user.role);
    return { message: 'Recipe delete' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateRecipe(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
    @Request() req: ExpressRequest & { user: UserDocument },
  ) {
    const updated = await this.recipesService.update(
      id,
      updateRecipeDto,
      req.user.role,
    );
    return { message: 'Recipe update', updated };
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  async findAllForAdmin() {
    return this.recipesService.findAllForAdmin();
  }
}
