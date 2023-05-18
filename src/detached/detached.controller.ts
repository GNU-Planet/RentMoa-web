import { Body, Controller, Post } from '@nestjs/common';
import { DetachedService } from './detached.service';

@Controller('detached')
export class DetachedController {
  constructor(private readonly detachedService: DetachedService) {}
  // 단독다가구 주택유형별 예측
  @Post('/type-area')
  async getPredictedAmountByArea(
    @Body('location') location: string,
    @Body('months') months: Array<number>,
  ) {
    if (!location) {
      location = '진주시';
    }

    const result = await this.detachedService.getPredictedAmountByArea(
      location,
      months,
    );

    return { result };
  }

  // 단독다가구 건축연한별 예측
  @Post('/built-year')
  async getPredictedAmountByBuiltYear(
    @Body('location') location: string,
    @Body('months') months: Array<number>,
  ) {
    if (!location) {
      location = '진주시';
    }
    const result = await this.detachedService.getPredictedAmountByBuiltYear(
      location,
      months,
    );
    return { result };
  }
}
