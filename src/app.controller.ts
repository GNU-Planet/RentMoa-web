import { Controller, Get, Render } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { AppService } from './app.service';
import { DetachedHouseRent } from './entity/app.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('home')
  getHome() {
    return;
  }

  @Get('/type-area')
  @Render('type_area')
  async getPredictedAmountByArea(): Promise<{
    result: { [key: string]: { [key: string]: number } };
  }> {
    const result = await this.appService.getPredictedAmountByArea();
    return { result };
  }
}
