import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository, FindManyOptions, Equal } from 'typeorm';
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
    charterRent: string,
  ): Promise<any> {
    const options: FindManyOptions = {
      where: {
        계약종료년: year,
        계약종료월: month,
        법정동: location === '진주시' ? Not(Like('%리')) : location,
      },
    };
    if (charterRent == '월세') {
      options.where['월세금액'] = Not(Equal(0));
    } else if (charterRent == '전세') {
      options.where['월세금액'] = Equal(0);
    }
    return await this.detachedHouseRentRepository.find(options);
  }

  async getPredictedAmountByDong(
    location: string,
    charterRent: string,
  ): Promise<{
    [key: string]: { [key: string]: number };
  }> {
    const result = {};
    for (const 계약종료월 of months) {
      const data = await this.getDetachedHouseRentData(
        location,
        계약종료월,
        charterRent,
      );
      const 법정동별_예측물량 = data.map(({ 법정동 }) => 법정동);

      법정동별_예측물량.forEach((label) => {
        result[label] = (result[label] || 0) + 1;
      });
    }
    const sortedResult = Object.entries(result)
      .sort(([, a], [, b]) => Number(b) - Number(a))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    return sortedResult;
  }

  async getPredictedAmountByArea(
    location: string,
    charterRent: string,
  ): Promise<{
    [key: string]: { [key: string]: number };
  }> {
    const result: { [key: string]: { [key: string]: number } } = {};
    const bins = [40, 85, 300];
    const labels = ['40㎡ 미만', '40-85㎡', '85㎡ 이상'];

    for (const 계약종료월 of months) {
      const data = await this.getDetachedHouseRentData(
        location,
        계약종료월,
        charterRent,
      );

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
