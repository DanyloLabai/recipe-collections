import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RecipeDocument = Recipe & Document;

export enum RecipeStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

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

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId: string;

  @Prop({ enum: RecipeStatus, default: RecipeStatus.PENDING })
  status: RecipeStatus;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
