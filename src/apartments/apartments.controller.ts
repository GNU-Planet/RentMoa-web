import { Body, Controller, Post } from '@nestjs/common';
import { ApartmentsService } from './apartments.service';

@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}
  // 아파트&오피스텔&연립다세대 위치 데이터 가져오기
  @Post('/location')
  async getApartmentsLocations(@Body('houseType') houseType: string) {
    const result = await this.apartmentsService.getApartmentsLocations(
      houseType,
    );

    return { result };
  }
  // 아파트&오피스텔&연립다세대 예측 요약
  @Post('/house')
  async getPredictedAmountByHouse(
    @Body('houseType') houseType: string,
    @Body('houseIdx') houseIdx: number,
    @Body('months') months: Array<number>,
  ) {
    const result = await this.apartmentsService.getPredictedAmountByHouse(
      houseType,
      houseIdx,
      months,
    );

    return { result };
  }

  // 아파트&오피스텔&연립다세대 면적별 예측
  @Post('/house-area')
  async getPredictedAmountByHouseArea(
    @Body('houseType') houseType: string,
    @Body('houseIdx') houseIdx: number,
    @Body('area') area: number,
    @Body('months') months: Array<number>,
    @Body('charterRent') charterRent: string,
  ) {
    const month = months[0];
    const result = await this.apartmentsService.getPredictedAmountByHouseArea(
      houseType,
      houseIdx,
      area,
      month,
      charterRent,
    );

    return { result };
  }
}
