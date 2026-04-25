import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateGameDto {
  @IsString()
  slug: string;

  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  image: string;

  @IsOptional()
  @IsBoolean()
  isOffer?: boolean;

  @IsOptional()
  @IsBoolean()
  isOutstanding?: boolean;

  @IsOptional()
  @IsArray()
  platforms?: string[];

  @IsOptional()
  @IsString()
  description?: string;
}
