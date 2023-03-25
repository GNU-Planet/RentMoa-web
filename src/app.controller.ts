import { Controller, Get, Render } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { AppService } from './app.service';
import { DetachedHouseRent } from './entity/app.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getAllHouses(): Promise<DetachedHouseRent[]> {
    const result = await this.appService.findAll();
    return Object.assign({
      data: result,
      statusCode: 200,
      statusMsg: `데이터 조회가 성공적으로 완료되었습니다.`,
    });
  }
}
