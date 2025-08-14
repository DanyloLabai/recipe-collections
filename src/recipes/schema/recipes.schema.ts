import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecipeDocument = Recipe & Document;

@Schema()
export class Recipe {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop([String])
  ingredients: string[];

  @Prop([String])
  steps: string[];

  @Prop()
  image: string;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
