import { IsArray, IsInt, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCartLineDto {
  @IsString()
  gameId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class UpdateCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateCartLineDto)
  lines: UpdateCartLineDto[];
}
