import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CartService } from './cart.service';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('me')
  getMe(@Req() req: { user: { sub: string } }) {
    return this.cartService.getByUserId(req.user.sub);
  }

  @Put('me')
  updateMe(@Req() req: { user: { sub: string } }, @Body() dto: UpdateCartDto) {
    return this.cartService.updateByUserId(req.user.sub, dto);
  }
}
