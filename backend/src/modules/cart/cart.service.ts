import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './cart.schema';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
  ) {}

  async getByUserId(userId: string) {
    let cart = await this.cartModel.findOne({ userId }).exec();
    if (!cart) cart = await this.cartModel.create({ userId, lines: [] });
    return cart;
  }

  async updateByUserId(userId: string, dto: UpdateCartDto) {
    const cart = await this.getByUserId(userId);
    cart.lines = dto.lines;
    return cart.save();
  }
}
