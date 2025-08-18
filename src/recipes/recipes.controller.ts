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

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  // @UseGuards(JwtAuthGuard)
  // @Post()
  // async submitRecipe(
  //   @Body() creteRcipeDto: CreateRecipeDto,
  //   @Request() req: ExpressRequest & { user: UserDocument },
  // ) {
  //   try {
  //     const user = req.user;

  //     if (!user?._id || !user.role) {
  //       throw new InternalServerErrorException('Invalid user data');
  //     }
  //     const isAdmin = req.user.role === UserRole.ADMIN;
  //     let userId: string;

  //     if (Types.ObjectId.isValid(user._id)) {
  //       userId = new Types.ObjectId(user._id).toHexString();
  //     } else {
  //       throw new InternalServerErrorException('Invalid user ID');
  //     }
  //     const recipe = await this.recipesService.create(
  //       creteRcipeDto,
  //       userId,
  //       isAdmin,
  //     );
  //     return {
  //       message: isAdmin ? 'Recipe added' : 'Recipe submitted for approval',
  //       recipe,
  //     };
  //   } catch (error) {
  //     console.error('Error in submitRecipe', error);
  //     throw new InternalServerErrorException('Could not submit recipe');
  //   }
  // }
  @Get()
  findAll() {
    return this.recipesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }
}
