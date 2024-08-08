import { Body, Controller, Post, Param, Query } from '@nestjs/common';
import { Get, Patch, UseGuards } from '@nestjs/common/decorators';
import { AuthUser } from 'src/common/decorators/user.decorators';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { WishesService } from 'src/wishes/wishes.service';
import { Wish } from 'src/wishes/wish.entity';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly wishService: WishesService,
  ) {}

  // получить данные по своему профилю
  @Get('me')
  async findOwn(@AuthUser() user: User): Promise<User> {
    return this.userService.findOne({
      where: { id: user.id },
      select: {
        email: true,
        username: true,
        id: true,
        avatar: true,
        about: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // получить всех пользователей
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // обновить данные по своему профилю
  @Patch('me')
  async updateOne(
    @AuthUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateOne(user.id, updateUserDto);
  }

  // получить данные профиля по имени
  @Get(':username')
  async getUserProfile(@Param('username') userName: string) {
    return await this.userService.findByName(userName);
  }

  // найти пользователя по почте или имени
  @Post('find')
  async findMany(@Query('query') query: string) {
    return await this.userService.findMany(query);
  }

  // получить список подароков текущего пользователя
  @Get('me/wishes')
  async findMyWishes(@AuthUser() user: User): Promise<Wish[]> {
    return this.wishService.findWishesById(user.id);
  }

  // получить список подароков пользователя по имени
  @Get(':username/wishes')
  async findWishes(@Param('username') userName: string): Promise<Wish[]> {
    const userData = await this.userService.findByName(userName);
    return this.wishService.findWishesById(userData.id);
  }
}
