import { Module } from '@nestjs/common';
import { ApartmentsController } from './apartments.controller';

@Module({
  controllers: [ApartmentsController]
})
export class ApartmentsModule {}
