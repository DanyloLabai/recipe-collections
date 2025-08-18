import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe, RecipeDocument, RecipeStatus } from './schema/recipes.schema';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { UserRole } from 'src/users/schema/user.schema';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
  ) {}

  async create(
    createRecipeDto: CreateRecipeDto,
    authId: string,
    isAdmin = false,
  ): Promise<Recipe> {
    const createdRecipe = new this.recipeModel({
      ...createRecipeDto,
      authId,
      status: isAdmin ? RecipeStatus.APPROVED : RecipeStatus.PENDING,
    });
    return await createdRecipe.save();
  }

  async findAll(): Promise<Recipe[]> {
    try {
      return await this.recipeModel
        .find({ status: RecipeStatus.APPROVED })
        .exec();
    } catch (error) {
      console.error('Error in findall', error);
      return [];
    }
  }

  async findAllForAdmin(): Promise<Recipe[]> {
    return this.recipeModel.find().exec();
  }

  async findOne(id: string): Promise<Recipe | null> {
    try {
      const recipe = await this.recipeModel.findById(id).exec();
      if (!recipe) {
        throw new NotFoundException(`Recipe with id ${id} not found`);
      }
      return recipe;
    } catch (error) {
      console.error('Error in findOne', error);
      return null;
    }
  }

  async remove(id: string, userRole: UserRole): Promise<void> {
    try {
      if (userRole !== UserRole.ADMIN)
        throw new ForbiddenException('Only admins can delete recipes');
      const deleted = await this.recipeModel.findByIdAndDelete(id).exec();
      if (!deleted) {
        throw new NotFoundException(`Recipe with id ${id} not found`);
      }
    } catch (error) {
      console.error('Error in delete', error);
      throw new InternalServerErrorException('Could not delete recipe');
    }
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    try {
      const updatedRecipe = await this.recipeModel
        .findByIdAndUpdate(id, updateRecipeDto, { new: true })
        .exec();

      if (!updatedRecipe) {
        throw new NotFoundException(`Recipe with id ${id} not found`);
      }

      return updatedRecipe;
    } catch (error) {
      console.error('Error updating recipe', error);
      throw new InternalServerErrorException('Could not update recipe');
    }
  }

  async changeStatus(id: string, status: RecipeStatus): Promise<Recipe> {
    try {
      const updated = await this.recipeModel
        .findByIdAndUpdate(id, { status }, { new: true })
        .exec();
      if (!updated)
        throw new NotFoundException(`Recipe with id ${id} not found`);
      return updated;
    } catch (error) {
      console.error('Error updating status recipe', error);
      throw new InternalServerErrorException('Could not update status recipe');
    }
  }
}
