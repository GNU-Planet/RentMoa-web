import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository } from 'typeorm';
import { DetachedHouseRent } from './entity/app.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(DetachedHouseRent)
    private detachedHouseRentRepository: Repository<DetachedHouseRent>,
  ) {
    this.detachedHouseRentRepository = detachedHouseRentRepository;
  }

  findAll(): Promise<DetachedHouseRent[]> {
    return this.detachedHouseRentRepository.find();
  }

  async getPredictedAmountByArea(location: string): Promise<{
    [key: string]: { [key: string]: number };
  }> {
    const result: { [key: string]: { [key: string]: number } } = {};
    const months = [6, 7, 8, 9, 10, 11, 12];
    const bins = [40, 85, 300];
    const labels = ['40㎡ 미만', '40-85㎡', '85㎡ 이상'];

    for (const 계약종료월 of months) {
      let data;
      if (location == '진주시') {
        data = await this.detachedHouseRentRepository.find({
          where: { 계약종료년: 2023, 계약종료월, 법정동: Not(Like('%리')) },
        });
      } else {
        data = await this.detachedHouseRentRepository.find({
          where: { 계약종료년: 2023, 계약종료월, 법정동: location },
        });
      }

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
