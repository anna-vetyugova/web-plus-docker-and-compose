import { IsNumber, IsBoolean, IsUrl } from 'class-validator';

export class UpdateOfferDto {
  @IsNumber()
  readonly user?: number;

  @IsUrl()
  readonly item?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  readonly amount?: number;

  @IsBoolean()
  readonly hidden?: boolean;
}
