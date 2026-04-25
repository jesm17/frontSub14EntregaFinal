import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favorite, FavoriteDocument } from './favorites.schema';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name)
    private readonly favoriteModel: Model<FavoriteDocument>,
  ) {}

  listByUser(userId: string) {
    return this.favoriteModel.find({ userId }).exec();
  }

  async toggle(userId: string, gameId: string) {
    const exists = await this.favoriteModel.findOne({ userId, gameId }).exec();
    if (exists) {
      await this.favoriteModel.deleteOne({ _id: exists._id });
      return { gameId, isFavorite: false };
    }
    await this.favoriteModel.create({ userId, gameId });
    return { gameId, isFavorite: true };
  }
}
