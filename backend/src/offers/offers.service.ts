import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { Wish } from 'src/wishes/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly userService: UsersService,
    private readonly wishService: WishesService,
    private dataSource: DataSource,
  ) {}

  async createOffer(createOfferDto: CreateOfferDto, userId: number) {
    const { amount, itemId } = createOfferDto;
    const user = await this.userService.findById(userId);
    const wish = await this.wishService.findWishById(itemId);

    if (wish.owner.id === userId) {
      throw new ForbiddenException(
        'Нельзя вносить деньги на собственные подарки',
      );
    }
    if (amount > wish.price - wish.raised) {
      throw new ForbiddenException(
        'Сумма собранных средств не может превышатть остаточной стоимость подарка',
      );
    }
    if (amount > wish.price) {
      throw new ForbiddenException(
        'Сумма не должна превышать стоимости подарка',
      );
    }
    if (wish.price === wish.raised) {
      throw new ForbiddenException(
        'Нельзя оставить заявку на сумму равную стоимости подарка',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(Wish, {
        ...wish,
        raised: Number(wish.raised) + amount,
      });
      const offer = await queryRunner.manager.save(Offer, {
        ...createOfferDto,
        item: wish,
        user: user,
      });
      await queryRunner.commitTransaction();
      return offer;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    // await this.wishService.updateRaisedAmount(wish.id, amount);
  }

  async getAllOffers(): Promise<Offer[]> {
    const offers = await this.offerRepository.find({
      relations: ['user'],
    });
    return offers;
  }

  async findOfferById(offerId: number): Promise<Offer> {
    const offer = this.offerRepository.findOne({
      where: { id: offerId },
      relations: ['user', 'item'],
    });
    if (!offer) {
      throw new NotFoundException('Оффер не найден');
    }
    return offer;
  }
}
