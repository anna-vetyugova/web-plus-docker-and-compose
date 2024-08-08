import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { AuthUser } from 'src/common/decorators/user.decorators';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OffersService } from './offers.service';

@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  // скинуться на подарок
  @Post()
  createOffer(@Body() createOfferDto: CreateOfferDto, @AuthUser() user) {
    return this.offersService.createOffer(createOfferDto, user.id);
  }

  // получить список всеок офферов
  @Get()
  findAllOffers() {
    return this.offersService.getAllOffers();
  }

  // получить оффер по ИД
  @Get(':id')
  findOfferById(@Param('id') id: number) {
    return this.offersService.findOfferById(id);
  }
}
