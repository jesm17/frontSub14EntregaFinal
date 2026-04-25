import { IsString } from 'class-validator';

export class ToggleFavoriteDto {
  @IsString()
  gameId: string;
}
