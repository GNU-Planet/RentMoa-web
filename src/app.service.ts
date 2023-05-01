import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository, FindManyOptions, Equal } from 'typeorm';
import { DetachedHouseRent } from './entity/app.entity';

const year = 2023;

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
    months: Array<number>,
  ): Promise<{ [key: string]: { 전세: number; 월세: number; 합계: number } }> {
    const result = {};
    for (const 계약종료월 of months) {
      const 전세데이터 = await this.getDetachedHouseRentData(
        location,
        계약종료월,
        '전세', // 전세 데이터 가져오기
      );
      const 월세데이터 = await this.getDetachedHouseRentData(
        location,
        계약종료월,
        '월세', // 월세 데이터 가져오기
      );

      // 각각의 데이터를 처리하여 result 객체에 추가
      전세데이터.forEach(({ 법정동 }) => {
        if (!result[법정동]) {
          result[법정동] = { 합계: 0, 전세: 0, 월세: 0 };
        }
        result[법정동].전세 += 1;
        result[법정동].합계 += 1;
      });

      월세데이터.forEach(({ 법정동 }) => {
        if (!result[법정동]) {
          result[법정동] = { 합계: 0, 전세: 0, 월세: 0 };
        }
        result[법정동].월세 += 1;
        result[법정동].합계 += 1;
      });
    }

    return result;
  }

  async getPredictedAmountByArea(location: string, months: Array<number>) {
    const result = {
      전세: { '40㎡ 미만': 0, '40-85㎡': 0, '85㎡ 이상': 0 },
      월세: { '40㎡ 미만': 0, '40-85㎡': 0, '85㎡ 이상': 0 },
      합계: { '40㎡ 미만': 0, '40-85㎡': 0, '85㎡ 이상': 0 },
    };
    const bins = [40, 85, 300];
    const labels = ['40㎡ 미만', '40-85㎡', '85㎡ 이상'];
    for (const 계약종료월 of months) {
      const 전세데이터 = await this.getDetachedHouseRentData(
        location,
        계약종료월,
        '전세', // 전세 데이터 가져오기
      );
      const 월세데이터 = await this.getDetachedHouseRentData(
        location,
        계약종료월,
        '월세', // 월세 데이터 가져오기
      );

      const 면적별_예측물량_전세 = 전세데이터.map(({ 계약면적 }) => 계약면적);
      const 면적별_예측물량_전세_구간 = 면적별_예측물량_전세.map((면적) => {
        const binIndex = bins.findIndex((bin) => 면적 < bin);
        return labels[binIndex];
      });
      면적별_예측물량_전세_구간.forEach((label) => {
        result['전세'][label] = (result['전세'][label] || 0) + 1;
        result['합계'][label] = (result['합계'][label] || 0) + 1;
      });

      const 면적별_예측물량_월세 = 월세데이터.map(({ 계약면적 }) => 계약면적);
      const 면적별_예측물량_월세_구간 = 면적별_예측물량_월세.map((면적) => {
        const binIndex = bins.findIndex((bin) => 면적 < bin);
        return labels[binIndex];
      });
      면적별_예측물량_월세_구간.forEach((label) => {
        result['월세'][label] = (result['월세'][label] || 0) + 1;
        result['합계'][label] = (result['합계'][label] || 0) + 1;
      });
    }
    return result;
  }

  async getPredictedAmountByBuiltYear(location: string, months: Array<number>) {
    const result = {
      전세: { '10년 미만': 0, '10-20년': 0, '20-30년': 0, '30년 이상': 0 },
      월세: { '10년 미만': 0, '10-20년': 0, '20-30년': 0, '30년 이상': 0 },
      합계: { '10년 미만': 0, '10-20년': 0, '20-30년': 0, '30년 이상': 0 },
    };
    const bins = [10, 20, 30, 100];
    const labels = ['10년 미만', '10-20년', '20-30년', '30년 이상'];

    for (const 계약종료월 of months) {
      const 전세데이터 = await this.getDetachedHouseRentData(
        location,
        계약종료월,
        '전세', // 전세 데이터 가져오기
      );
      const 월세데이터 = await this.getDetachedHouseRentData(
        location,
        계약종료월,
        '월세', // 월세 데이터 가져오기
      );

      const 건축년도별_예측물량_전세 = 전세데이터
        .map(({ 건축년도 }) => 건축년도)
        .filter(Boolean);
      const 건축년도별_예측물량_전세_구간 = 건축년도별_예측물량_전세.map(
        (년도) => {
          const binIndex = bins.findIndex(
            (bin) => new Date().getFullYear() - Number(년도) < bin,
          );
          return labels[binIndex];
        },
      );

      건축년도별_예측물량_전세_구간.forEach((label) => {
        result['전세'][label] = (result['전세'][label] || 0) + 1;
        result['합계'][label] = (result['합계'][label] || 0) + 1;
      });

      const 건축년도별_예측물량_월세 = 월세데이터
        .map(({ 건축년도 }) => 건축년도)
        .filter(Boolean);
      const 건축년도별_예측물량_월세_구간 = 건축년도별_예측물량_월세.map(
        (년도) => {
          const binIndex = bins.findIndex(
            (bin) => new Date().getFullYear() - Number(년도) < bin,
          );
          return labels[binIndex];
        },
      );

      건축년도별_예측물량_월세_구간.forEach((label) => {
        result['월세'][label] = (result['월세'][label] || 0) + 1;
        result['합계'][label] = (result['합계'][label] || 0) + 1;
      });
    }

    return result;
  }
}
