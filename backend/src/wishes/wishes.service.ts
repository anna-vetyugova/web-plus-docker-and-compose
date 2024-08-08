import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Repository, FindOneOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { UsersService } from 'src/users/users.service';
import {
  BadRequestException,
  ConflictException,
} from '@nestjs/common/exceptions';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly userService: UsersService,
  ) {}

  // создать подарок
  async createWish(
    createWishDto: CreateWishDto,
    userId: number,
  ): Promise<Wish> {
    const owner = await this.userService.findById(userId);
    const wish = this.wishRepository.create({
      ...createWishDto,
      owner: owner,
    });
    return this.wishRepository.save(wish);
  }

  // найти подарки текущего пользователя
  async findWishesById(userId: number): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      where: { owner: { id: userId } },
    });
    if (!wishes.length) {
      throw new NotFoundException(
        `Подарки для текущего пользователя не найдены`,
      );
    }
    return wishes;
  }

  // получить все подарки
  async findAll(): Promise<Wish[]> {
    return this.wishRepository.find();
  }

  // получить подарок по ИД
  async findOne(query: FindOneOptions<Wish>) {
    const wish = await this.wishRepository.findOneOrFail(query);
    if (!wish) {
      throw new NotFoundException(`Подарок не найден`);
    }
    return wish;
  }

  async findWishById(id: number): Promise<Wish> {
    if (!id) {
      throw new BadRequestException(`Отсутсвует ИД подарка`);
    }
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.user'],
    });
    if (!wish) {
      throw new NotFoundException(`Подарок не найден`);
    }
    wish.offers = wish.offers.map((offer) => ({
      ...offer,
      name: offer.user.username,
    }));
    return wish;
  }

  // обновить информацию о подарке
  async updateWish(
    wishId: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ): Promise<Wish> {
    const wish = await this.findWishById(wishId);
    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Вы не можете изменять чужие подарки');
    }
    const updatedWish = await this.wishRepository.merge(wish, updateWishDto);
    return this.wishRepository.save(updatedWish);
  }

  // обновить признак copied у подарока
  async updateCopiedWish(wishId: number): Promise<Wish> {
    const wish = await this.findWishById(wishId);
    const counter = wish.copied;
    const updatedWish = this.wishRepository.merge(wish, {
      copied: counter + 1,
    });
    return this.wishRepository.save(updatedWish);
  }

  // обновить сумму скинувшихся на подарок
  async updateRaisedAmount(wishId: number, raised: number): Promise<Wish> {
    const wish = await this.findWishById(wishId);
    const newRaised = Number(wish.raised) + Number(raised);
    this.wishRepository.merge(wish, { raised: newRaised });
    return this.wishRepository.save(wish);
  }

  // удалить подарок
  async deleteWish(wishId: number, userId: number): Promise<Wish> {
    const wish = await this.findWishById(wishId);
    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Вы не можете удалять чужие подарки');
    }
    return await this.wishRepository.remove(wish);
  }

  //показать последние добавленные подарки
  async getLastWishes() {
    // return await this.wishRepository.find();
    const wishes = await this.wishRepository.find({
      relations: {
        owner: true,
        offers: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });
    if (!wishes) {
      throw new NotFoundException('Последние подарки не найдены');
    }
    return wishes;
  }

  //показать популярные подарки
  async getTopWishes() {
    const topWishes = await this.wishRepository.find({
      relations: ['owner', 'offers'],
      order: {
        copied: 'DESC',
      },
      take: 10,
    });
    if (!topWishes.length) {
      throw new NotFoundException('Популярные подарки не найдены');
    }
    return topWishes;
  }

  // получить массиов подароков по ИД
  async getWishesByIds(ids: number[]) {
    const wishes = await Promise.all(ids.map((id) => this.findWishById(id)));
    return wishes;
  }

  async updateWishWithOffer(id: number, amount: number) {
    return await this.wishRepository.update({ id }, { raised: amount });
  }

  // копировать подарок
  async copyWish(wishId: number, userId: number): Promise<Wish> {
    // получить данные о подарке по ИД
    const wish = await this.wishRepository.findOne({
      select: {
        name: true,
        link: true,
        image: true,
        price: true,
        description: true,
      },
      where: { id: wishId },
    });

    // получить юзера, кто копирует
    const user = await this.userService.findById(userId);

    // проверим, что подарок не был скопирован ранее
    const existingCopy = await this.wishRepository.findOne({
      where: {
        owner: { id: userId },
        name: wish.name,
        link: wish.link,
      },
    });

    if (existingCopy) {
      throw new ConflictException(`Вы уже скопировали этот подарок`);
    }
    const copiedWish = this.wishRepository.create({
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
      owner: user,
      raised: 0,
      copied: (wish.copied || 0) + 1,
    });

    // обновим признак copied у оригинального подарка
    await this.updateCopiedWish(wishId);

    return this.wishRepository.save(copiedWish);
  }
}
