import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe, RecipeDocument } from './schema/recipes.schema';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
  ) {}

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const createdRecipe = new this.recipeModel(createRecipeDto);
    return await createdRecipe.save();
  }

  async findAll(): Promise<Recipe[]> {
    try {
      return await this.recipeModel.find().exec();
    } catch (error) {
      console.error('Error in findall', error);
      return [];
    }
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

  async remove(id: string): Promise<void> {
    try {
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
}
