import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FavoritesService } from './favorites.service';
import { ToggleFavoriteDto } from './dto/toggle-favorite.dto';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get('me')
  listMe(@Req() req: { user: { sub: string } }) {
    return this.favoritesService.listByUser(req.user.sub);
  }

  @Post('toggle')
  toggle(
    @Req() req: { user: { sub: string } },
    @Body() dto: ToggleFavoriteDto,
  ) {
    return this.favoritesService.toggle(req.user.sub, dto.gameId);
  }
}
