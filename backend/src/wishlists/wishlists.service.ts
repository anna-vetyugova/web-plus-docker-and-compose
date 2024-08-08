import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { User } from 'src/users/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly wishService: WishesService,
  ) {}

  // создать список
  async createWishlist(
    createWishlistDto: CreateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const { itemsId } = createWishlistDto;
    const wishes = await this.wishService.getWishesByIds(itemsId);
    console.log(wishes);
    if (wishes.length === 0) {
      throw new ForbiddenException('Коллекция не может быть пустой');
    }
    const wishlist = this.wishlistRepository.create({
      ...createWishlistDto,
      items: wishes,
      owner: user,
    });
    return this.wishlistRepository.save(wishlist);
  }

  // получить коллекцию по ИД
  async findWisheListById(id: number): Promise<Wishlist> {
    const wishelist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['items', 'owner'],
    });

    if (!wishelist) {
      throw new NotFoundException(`Коллекция не найдена`);
    }
    return wishelist;
  }

  // получить все коллекции
  async findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      relations: ['items', 'owner'],
    });
  }

  // удалить коллекцию
  async deleteWishlist(wishlistId: number, userId: number): Promise<Wishlist> {
    const wishlist = await this.findWisheListById(wishlistId);
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Вы не можете удалять чужие коллекции');
    }
    return await this.wishlistRepository.remove(wishlist);
  }

  // изменить коллекцию
  async changeWishlist(
    id: number,
    userId: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: {
        id: id,
      },
      relations: ['items', 'owner'],
    });
    if (!wishlist) {
      throw new NotFoundException(`Коллекция не найдена`);
    }
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Вы не можете изменять чужую коллекцию');
    }

    return this.wishlistRepository.save({ ...wishlist, ...updateWishlistDto });
  }
}
