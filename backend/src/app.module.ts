import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import * as Joi from 'joi';
import { DatabaseConfigFactory } from './config/database-config.factory';
import { AuthModule } from './auth/auth.module';

const schema = Joi.object({
  server: Joi.object({
    port: Joi.number().integer().default(3000),
  }),
  database: Joi.object({
    host: Joi.string().required(),
    port: Joi.number().integer().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
  }),
  jwt: Joi.object({
    secret: Joi.string().required(),
    ttl: Joi.string().required(),
  }),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: schema,
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigFactory,
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
