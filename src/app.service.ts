import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
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

  async getPredictedAmountByArea(): Promise<{
    [key: string]: { [key: string]: number };
  }> {
    const result: { [key: string]: { [key: string]: number } } = {};
    const months = [6, 7, 8, 9, 10, 11, 12];
    const bins = [40, 85, 300];
    const labels = ['40㎡ 미만', '40-85㎡', '85㎡ 이상'];

    for (const 월 of months) {
      const data = await this.detachedHouseRentRepository.find({
        where: { 월 },
      });

      const 면적별_예측물량 = data.map(({ 계약면적 }) => 계약면적);
      const 면적별_예측물량_구간 = 면적별_예측물량.map((면적) => {
        const binIndex = bins.findIndex((bin) => 면적 < bin);
        return labels[binIndex];
      });

      const valueCounts = {};
      면적별_예측물량_구간.forEach((label) => {
        valueCounts[label] = (valueCounts[label] || 0) + 1;
      });

      result[월.toString()] = valueCounts;
    }
    return result;
  }
}
