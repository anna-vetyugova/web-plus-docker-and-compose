import { IsNumber, IsBoolean } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  itemId: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @IsBoolean()
  hidden: boolean;
}
