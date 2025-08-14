export class CreateRecipeDto {
  title: string;
  description?: string;
  ingredients?: string[];
  steps?: string[];
  image?: string;
}
