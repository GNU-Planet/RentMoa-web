import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository } from 'typeorm';
import { DetachedHouseRent } from './entity/app.entity';

const year = 2023;
const months = [6, 7, 8, 9, 10, 11, 12];

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(DetachedHouseRent)
    private detachedHouseRentRepository: Repository<DetachedHouseRent>,
  ) {
    this.detachedHouseRentRepository = detachedHouseRentRepository;
  }

  async getDetachedHouseRentData(
    location: string,
    month: number,
  ): Promise<any> {
    if (location == '진주시') {
      return await this.detachedHouseRentRepository.find({
        where: {
          계약종료년: year,
          계약종료월: month,
          법정동: Not(Like('%리')),
        },
      });
    } else {
      return await this.detachedHouseRentRepository.find({
        where: { 계약종료년: year, 계약종료월: month, 법정동: location },
      });
    }
  }

  async getPredictedAmountByDong(location: string): Promise<{
    [key: string]: { [key: string]: number };
  }> {
    const result: { [key: string]: { [key: string]: number } } = {};
    return result;
  }

  async getPredictedAmountByArea(location: string): Promise<{
    [key: string]: { [key: string]: number };
  }> {
    const result: { [key: string]: { [key: string]: number } } = {};
    const bins = [40, 85, 300];
    const labels = ['40㎡ 미만', '40-85㎡', '85㎡ 이상'];

    for (const 계약종료월 of months) {
      const data = await this.getDetachedHouseRentData(location, 계약종료월);

      const 면적별_예측물량 = data.map(({ 계약면적 }) => 계약면적);
      const 면적별_예측물량_구간 = 면적별_예측물량.map((면적) => {
        const binIndex = bins.findIndex((bin) => 면적 < bin);
        return labels[binIndex];
      });

      const valueCounts = {};
      면적별_예측물량_구간.forEach((label) => {
        valueCounts[label] = (valueCounts[label] || 0) + 1;
      });

      result[계약종료월.toString()] = valueCounts;
    }
    return result;
  }
}
