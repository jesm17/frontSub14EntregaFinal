import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GameDocument = HydratedDocument<Game>;

@Schema({ timestamps: true })
export class Game {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  image: string;

  @Prop({ default: false })
  isOffer: boolean;

  @Prop({ default: false })
  isOutstanding: boolean;

  @Prop({ type: [String], default: [] })
  platforms: string[];

  @Prop({ default: '' })
  description: string;
}

export const GameSchema = SchemaFactory.createForClass(Game);
