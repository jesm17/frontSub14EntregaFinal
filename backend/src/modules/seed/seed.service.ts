import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';
import { User, UserDocument } from '../users/users.schema';
import { Game, GameDocument } from '../games/games.schema';
import { seedGames } from './seed.data';

const bcryptHash = hash as (
  data: string,
  saltOrRounds: number,
) => Promise<string>;

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Game.name) private readonly gameModel: Model<GameDocument>,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
    await this.seedCatalog();
  }

  private async seedAdmin() {
    try {
      const email = 'admin@admin.com';
      const exists = await this.userModel.findOne({ email }).exec();
      if (exists) return;
      const passwordHash = await bcryptHash('admin', 10);
      await this.userModel.create({
        name: 'Administrador',
        email,
        passwordHash,
        role: 'admin',
      });
      this.logger.log('Admin seed created: admin@admin.com/admin');
    } catch (error) {
      this.logger.error('Error seeding admin: ', error);
    }
  }

  private async seedCatalog() {
    try {
      const count = await this.gameModel.countDocuments().exec();
      if (count > 0) return;
      await this.gameModel.insertMany(seedGames);
      this.logger.log(`Catalog seed created: ${seedGames.length} games`);
    } catch (error) {
      this.logger.error('Error seeding catalog: ', error);
    }
  }
}
