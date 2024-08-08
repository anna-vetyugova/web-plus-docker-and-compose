import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateWishDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  readonly name: string;

  @IsUrl()
  readonly link?: string;

  @IsUrl()
  readonly image?: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  readonly price: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  readonly raised?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  readonly owner: number;

  @IsString()
  @Length(1, 1024)
  readonly description: string;

  @IsOptional()
  @IsNumber()
  readonly copied: number;
}
