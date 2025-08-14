import { PartialType } from '@nestjs/mapped-types';
import { CreateRecipeDto } from './create-recipe.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {}
