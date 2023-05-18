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

  async getHouseDetailData(
    houseType: string,
    houseName: string,
    month: number,
    charterRent: string,
  ) {
    const options: FindManyOptions = {
      where: {
        계약종료년: year,
        계약종료월: month,
        단지: houseName,
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

  async getPredictedAmountByHouse(
    houseType: string,
    houseName: string,
    months: Array<number>,
  ) {
    const result = { 합계: 0, 전세: 0, 월세: 0 };
    for (const 계약종료월 of months) {
      const 전세데이터 = await this.getHouseDetailData(
        houseType,
        houseName,
        계약종료월,
        '전세', // 전세 데이터 가져오기
      );
      const 월세데이터 = await this.getHouseDetailData(
        houseType,
        houseName,
        계약종료월,
        '월세', // 월세 데이터 가져오기
      );

      // 각각의 데이터를 처리하여 result 객체에 추가
      전세데이터.forEach(() => {
        result.전세 += 1;
        result.합계 += 1;
      });

      월세데이터.forEach(() => {
        result.월세 += 1;
        result.합계 += 1;
      });
    }

    return result;
  }

  async getPredictedAmountByHouseArea(
    houseType: string,
    houseName: string,
    area: number,
    months: Array<number>,
  ) {
    let areasArray;
    let results = {};
    let selectedRepository, selectedTable;
    if (houseType == '아파트') {
    } else if (houseType == '오피스텔') {
      selectedRepository = this.offiRentRepository;
      selectedTable = 'offiRent';
    }

    if (!area) {
      const areas = await selectedRepository
        .createQueryBuilder(selectedTable)
        .select(`TRUNCATE(${selectedTable}.전용면적, 0)`, '전용면적')
        .distinct(true)
        .where(`${selectedTable}.단지 LIKE :keyword`, {
          keyword: `%${houseName}%`,
        })
        .orderBy('전용면적', 'ASC')
        .getRawMany();
      areasArray = areas.map((areas) => areas.전용면적);
    } else {
      areasArray = [area];
    }

    for (const area of areasArray) {
      const contracts = await selectedRepository
        .createQueryBuilder(selectedTable)
        .select(
          `CONCAT(RIGHT(${selectedTable}.년, 2), '.', LPAD(${selectedTable}.월, 2, '0'), '.', LPAD(${selectedTable}.일, 2, '0')) AS 날짜,
          CONCAT(${selectedTable}.보증금액, '/', ${selectedTable}.월세금액) AS 금액, 
          층`,
        )
        .where(`${selectedTable}.단지 LIKE :keyword`, {
          keyword: `%${houseName}%`,
        })
        .andWhere(`TRUNCATE(${selectedTable}.전용면적, 0) = :area`, { area })
        .andWhere(`${selectedTable}.계약종료년 = :year`, { year })
        .andWhere(`${selectedTable}.계약종료월 IN (:...months)`, { months })
        .limit(5)
        .getRawMany();
      results[area] = contracts;
    }

    return results;
  }
}
