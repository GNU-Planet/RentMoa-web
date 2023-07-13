import { Module } from '@nestjs/common';
import { ApartmentsController } from './apartments.controller';
import { ApartmentsService } from './apartments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ApartmentInfo,
  ApartmentRent,
  OffiInfo,
  OffiRent,
  RowHouseInfo,
  RowHouseRent,
} from '../entity/app.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ApartmentInfo,
      ApartmentRent,
      OffiRent,
      OffiInfo,
      RowHouseInfo,
      RowHouseRent,
    ]),
  ],
  controllers: [ApartmentsController],
  providers: [ApartmentsService],
})
export class ApartmentsModule {}
