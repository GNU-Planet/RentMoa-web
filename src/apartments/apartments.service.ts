import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OffiRent, OffiInfo } from './entity/apartments.entity';
import { Equal, FindManyOptions, Not, Repository } from 'typeorm';

@Injectable()
export class ApartmentsService {
  constructor(
    @InjectRepository(OffiRent)
    private readonly offiRentRepository: Repository<OffiRent>,
    @InjectRepository(OffiInfo)
    private readonly offiInfoRepository: Repository<OffiInfo>,
  ) {
    this.offiRentRepository = offiRentRepository;
    this.offiInfoRepository = offiInfoRepository;
  }

  async getApartmentsLocations(houseType: string) {
    const result = await this.offiInfoRepository
      .createQueryBuilder('offiRent')
      .getRawMany();

    return { result };
  }

  async getHouseDetailData(
    houseType: string,
    houseIdx: number,
    month: number,
    charterRent: string,
  ) {
    /*
    // HouseInfo 테이블에서 houseName에 해당하는 단지명 조회
    const houseInfo = await this.offiInfoRepository.findOne({
      where: { ComplexName: houseName },
    });
    if (!houseInfo) {
      // 단지명에 해당하는 정보가 없는 경우 처리
      throw new NotFoundException('단지명을 찾을 수 없습니다.');
    }*/

    const options: FindManyOptions = {
      where: {
        계약종료년: 2023,
        계약종료월: month,
        단지ID: houseIdx,
      },
    };
    if (charterRent == '월세') {
      options.where['월세금액'] = Not(Equal(0));
    } else if (charterRent == '전세') {
      options.where['월세금액'] = Equal(0);
    }
    return await this.offiRentRepository.find(options);
  }

  async getPredictedAmountByHouse(
    houseType: string,
    houseIdx: number,
    months: Array<number>,
  ) {
    const result = { 합계: 0, 전세: 0, 월세: 0 };
    for (const 계약종료월 of months) {
      const 전세데이터 = await this.getHouseDetailData(
        houseType,
        houseIdx,
        계약종료월,
        '전세', // 전세 데이터 가져오기
      );
      const 월세데이터 = await this.getHouseDetailData(
        houseType,
        houseIdx,
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
    houseIdx: number,
    area: number,
    months: Array<number>,
  ) {
    let results = {};
    let selectedRepository, selectedTable;
    if (houseType == '아파트') {
    } else if (houseType == '오피스텔') {
      selectedRepository = this.offiRentRepository;
      selectedTable = 'offiRent';
    }
    try {
      const contracts = await selectedRepository
        .createQueryBuilder(selectedTable)
        .select(
          `CONCAT(RIGHT(${selectedTable}.년, 2), '.', LPAD(${selectedTable}.월, 2, '0'), '.', LPAD(${selectedTable}.일, 2, '0')) AS 날짜,
            CONCAT(${selectedTable}.보증금액, '/', ${selectedTable}.월세금액) AS 금액, 
            층`,
        )
        .where(`${selectedTable}.단지ID LIKE :keyword`, {
          keyword: `%${houseIdx}%`,
        })
        .andWhere(`TRUNCATE(${selectedTable}.전용면적, 0) = :area`, { area })
        .andWhere(`${selectedTable}.계약종료년 = :year`, { year: 2023 })
        .andWhere(`${selectedTable}.계약종료월 IN (:...months)`, { months })
        .limit(5)
        .getRawMany();
      results[area] = contracts;
    } catch (err) {
      console.log('err here');
    }

    return results;
  }
}
