import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository, FindManyOptions, Equal } from 'typeorm';
import { DetachedHouseRent, OffiRent } from './entity/app.entity';

const year = 2023;

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(DetachedHouseRent)
    private detachedHouseRentRepository: Repository<DetachedHouseRent>,
    @InjectRepository(OffiRent)
    private offiRentRepository: Repository<OffiRent>,
  ) {
    this.detachedHouseRentRepository = detachedHouseRentRepository;
    this.offiRentRepository = offiRentRepository;
  }

  async getHouseDongData(
    houseType: string,
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
    if (houseType == '단독다가구')
      return await this.detachedHouseRentRepository.find(options);
    else if (houseType == '오피스텔')
      return await this.offiRentRepository.find(options);
  }

  async getPredictedAmountByDong(
    houseType: string,
    location: string,
    months: Array<number>,
  ): Promise<{ [key: string]: { 전세: number; 월세: number; 합계: number } }> {
    const result = {};
    for (const 계약종료월 of months) {
      const 전세데이터 = await this.getHouseDongData(
        houseType,
        location,
        계약종료월,
        '전세', // 전세 데이터 가져오기
      );
      const 월세데이터 = await this.getHouseDongData(
        houseType,
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
}
