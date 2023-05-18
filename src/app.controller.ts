import { Controller, Get, Render } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // ConfigService 추가
import { Body, Param, Post, Query } from '@nestjs/common/decorators';
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
      '오피스텔',
      '진주시',
      [7],
    );
    const API_KEY = this.configService.get('KAKAO_MAPS_API_KEY');
    return { API_KEY, result };
  }

  @Post('/dong')
  async getPredictedAmountByDong(
    @Body('houseType') houseType: string,
    @Body('location') location: string,
    @Body('months') months: Array<number>,
  ) {
    if (!location) {
      location = '진주시';
    }
    const result = await this.appService.getPredictedAmountByDong(
      houseType,
      location,
      months,
    );
    return { result };
  }
}
