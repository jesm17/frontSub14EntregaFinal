import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ _id: false })
export class CartLine {
  @Prop({ required: true })
  gameId: string;

  @Prop({ required: true })
  quantity: number;
}

@Schema({ timestamps: true })
export class Cart {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ type: [CartLine], default: [] })
  lines: CartLine[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
