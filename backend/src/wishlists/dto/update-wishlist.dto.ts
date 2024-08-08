import { IsArray, IsString, IsUrl, Length } from 'class-validator';

export class UpdateWishlistDto {
  @IsString()
  @Length(1, 250)
  readonly name?: string;

  @IsString()
  @Length(1, 1500)
  readonly description?: string;

  @IsUrl()
  readonly image?: string;

  @IsArray()
  readonly itemsId?: number[];
}
