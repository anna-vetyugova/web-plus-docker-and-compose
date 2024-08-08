import { IsNumber, IsString, IsUrl, Length } from 'class-validator';

export class UpdateWishDto {
  @IsString()
  @Length(1, 250)
  readonly name?: string;

  @IsUrl()
  readonly link?: string;

  @IsUrl()
  readonly image?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  readonly price?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  readonly raised?: number;

  @IsNumber()
  readonly ownerId?: number;

  @IsString()
  @Length(1, 1024)
  readonly description?: string;

  @IsNumber()
  readonly copied?: number;
}
