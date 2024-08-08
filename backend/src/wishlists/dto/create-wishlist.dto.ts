import {
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  readonly name: string;

  @IsOptional()
  @IsString()
  @Length(1, 1500)
  readonly description?: string;

  @IsUrl()
  readonly image?: string;

  @IsArray()
  readonly itemsId?: number[];
}
