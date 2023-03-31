import { Controller, Get, Render } from '@nestjs/common';
import { Param, Query } from '@nestjs/common/decorators';
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
  async getPredictedAmountByArea(@Query('location') location: string): Promise<{
    region: string;
    result: { [key: string]: { [key: string]: number } };
  }> {
    if (!location) {
      location = '진주시';
    }
    const result = await this.appService.getPredictedAmountByArea(location);
    return { region: location, result };
  }
}
