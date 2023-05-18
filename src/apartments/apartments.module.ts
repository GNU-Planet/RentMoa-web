import { Module } from '@nestjs/common';
import { ApartmentsController } from './apartments.controller';
import { ApartmentsService } from './apartments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffiRent } from 'src/entity/app.entity';
import { OffiInfo } from './entity/apartments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OffiRent, OffiInfo])],
  controllers: [ApartmentsController],
  providers: [ApartmentsService],
})
export class ApartmentsModule {}
