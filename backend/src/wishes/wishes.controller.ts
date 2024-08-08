import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { CreateWishDto } from './dto/create-wish.dto';
import { WishesService } from './wishes.service';
import { AuthUser } from 'src/common/decorators/user.decorators';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Patch } from '@nestjs/common/decorators';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishService: WishesService) {}

  // создать подарок
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createWishDto: CreateWishDto, @AuthUser() user) {
    return this.wishService.createWish(createWishDto, user.id);
  }

  // получить все подарки
  @Get()
  findAll() {
    return this.wishService.findAll();
  }

  // обновить подарок
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateWish(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @AuthUser() user,
  ) {
    return this.wishService.updateWish(id, updateWishDto, user.id);
  }

  // удалить подарок
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteWish(@Param('id') id: number, @AuthUser() user) {
    return this.wishService.deleteWish(id, user.id);
  }

  // найти последние добавленные
  @Get('last')
  findLastWishes() {
    return this.wishService.getLastWishes();
  }

  @Get('top')
  getTopWishes() {
    return this.wishService.getTopWishes();
  }

  // получить подарок по ИД
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findWishById(@Param('id') id: number) {
    return this.wishService.findWishById(id);
  }

  // скопировать подарок
  @Post(':id/copy')
  @UseGuards(JwtAuthGuard)
  copy(@Param('id') id: number, @AuthUser() user) {
    return this.wishService.copyWish(id, user.id);
  }
}
