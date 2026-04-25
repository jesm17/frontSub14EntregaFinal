import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './games.schema';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    AuthModule,
  ],
  providers: [GamesService],
  controllers: [GamesController],
  exports: [GamesService, MongooseModule],
})
export class GamesModule {}
