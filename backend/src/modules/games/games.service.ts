import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from './games.schema';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name) private readonly gameModel: Model<GameDocument>,
  ) {}

  findAll() {
    return this.gameModel.find().sort({ createdAt: -1 }).exec();
  }

  async findAllPaginated(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.gameModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.gameModel.countDocuments().exec(),
    ]);
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  findOffers() {
    return this.gameModel.find({ isOffer: true }).exec();
  }

  async findOffersPaginated(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;
    const filter = { isOffer: true };
    const [items, total] = await Promise.all([
      this.gameModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.gameModel.countDocuments(filter).exec(),
    ]);
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  findOutstanding() {
    return this.gameModel.find({ isOutstanding: true }).exec();
  }

  async findOne(id: string) {
    const byId = await this.gameModel.findById(id).exec();
    if (byId) return byId;
    const bySlug = await this.gameModel.findOne({ slug: id }).exec();
    if (bySlug) return bySlug;
    throw new NotFoundException('Juego no encontrado');
  }

  create(dto: CreateGameDto) {
    return this.gameModel.create(dto);
  }

  async update(id: string, dto: UpdateGameDto) {
    const game = await this.findOne(id);
    Object.assign(game, dto);
    return game.save();
  }

  async remove(id: string) {
    const game = await this.findOne(id);
    await this.gameModel.deleteOne({ _id: game._id });
    return { ok: true };
  }
}
