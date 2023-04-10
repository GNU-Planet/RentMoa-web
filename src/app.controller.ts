import { Controller, Get, Render } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // ConfigService 추가
import { Param, Query } from '@nestjs/common/decorators';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @Render('home')
  getHome() {
    return;
  }

  @Get('/map')
  @Render('map')
  async getMap() {
    const result = await this.appService.getPredictedAmountByDong(
      '진주시',
      '전월세',
      [7],
    );
    const API_KEY = this.configService.get('KAKAO_MAPS_API_KEY');
    return { API_KEY, result };
  }

  @Get('/type-area')
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
      [],
    );
    return { region: location, charterRent, result };
  }

  @Get('/built-year')
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
