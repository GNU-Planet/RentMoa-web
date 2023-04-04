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
  async getPredictedAmountByArea(
    @Query('location') location: string,
    @Query('charterRent') charterRent: string,
  ): Promise<{
    region: string;
    charterRent: string;
    result: { [key: string]: { [key: string]: number } };
  }> {
    if (!location) {
      location = '진주시';
    }
    if (!charterRent) {
      charterRent = '전월세';
    }
    const result = await this.appService.getPredictedAmountByArea(
      location,
      charterRent,
    );
    return { region: location, charterRent, result };
  }

  @Get('/dong')
  @Render('dong')
  async getPredictedAmountByDong(
    @Query('location') location: string,
    @Query('charterRent') charterRent: string,
  ): Promise<{
    region: string;
    charterRent: string;
    result: { [key: string]: { [key: string]: number } };
  }> {
    if (!location) {
      location = '진주시';
    }
    if (!charterRent) {
      charterRent = '전월세';
    }
    const result = await this.appService.getPredictedAmountByDong(
      location,
      charterRent,
    );
    return { region: location, charterRent, result };
  }

  @Get('/built-year')
  @Render('built_year')
  async getPredictedAmountByBuiltYear(
    @Query('location') location: string,
    @Query('charterRent') charterRent: string,
  ): Promise<{
    region: string;
    charterRent: string;
    result: { [key: string]: { [key: string]: number } };
  }> {
    if (!location) {
      location = '진주시';
    }
    if (!charterRent) {
      charterRent = '전월세';
    }
    const result = await this.appService.getPredictedAmountByBuiltYear(
      location,
      charterRent,
    );
    return { region: location, charterRent, result };
  }
}
