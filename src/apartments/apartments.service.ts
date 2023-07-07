import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ApartmentInfo,
  ApartmentRent,
  OffiRent,
  OffiInfo,
} from '../entity/app.entity';
import { Between, Equal, FindManyOptions, In, Not, Repository } from 'typeorm';

const year = 2023;

@Injectable()
export class ApartmentsService {
  constructor(
    @InjectRepository(ApartmentRent)
    private readonly apartmentRentRepository: Repository<ApartmentRent>,
    @InjectRepository(ApartmentInfo)
    private readonly apartmentInfoRepository: Repository<ApartmentInfo>,
    @InjectRepository(OffiInfo)
    private readonly offiInfoRepository: Repository<OffiInfo>,
    @InjectRepository(OffiRent)
    private readonly offiRentRepository: Repository<OffiRent>,
  ) {
    this.apartmentRentRepository = apartmentRentRepository;
    this.apartmentInfoRepository = apartmentInfoRepository;
    this.offiRentRepository = offiRentRepository;
    this.offiInfoRepository = offiInfoRepository;
  }

  async getApartmentsLocations(houseType: string): Promise<any> {
    let result;
    if (houseType === '아파트') {
      result = await this.apartmentInfoRepository.find();
    } else if (houseType === '오피스텔') {
      result = await this.offiInfoRepository.find();
    }
    return result;
  }

  async getHouseDetailData(
    houseType: string,
    houseIdx: number,
    month: number,
    charterRent: string,
  ): Promise<any> {
    const options: FindManyOptions = {
      where: {
        contract_end_date: Between(
          new Date(`${year}-${month}-01`),
          new Date(`${year}-${month}-31`),
        ),
        building_id: houseIdx,
      },
    };
    if (charterRent == '월세') {
      options.where['monthly_rent'] = Not(Equal(0));
    } else if (charterRent == '전세') {
      options.where['monthly_rent'] = Equal(0);
    }
    if (houseType == '오피스텔')
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
    month: number,
  ) {
    let results = {};
    let areasArray;
    let selectedRepository, selectedTable;
    if (houseType == '아파트') {
    } else if (houseType == '오피스텔') {
      selectedRepository = this.offiRentRepository;
      selectedTable = 'offi_contract';
    }
    if (!area) {
      const areas = await selectedRepository
        .createQueryBuilder(selectedTable)
        .select(
          `TRUNCATE(${selectedTable}.contract_area/3.3, 0)`,
          'contract_area',
        )
        .distinct(true)
        .where(`${selectedTable}.building_id LIKE :keyword`, {
          keyword: `${houseIdx}`,
        })
        .orderBy('contract_area', 'ASC')
        .getRawMany();
      areasArray = areas.map((areas) => areas.contract_area);
    } else {
      areasArray = [area];
    }

    for (const area of areasArray) {
      const contracts = await selectedRepository
        .createQueryBuilder(selectedTable)
        .select(
          `DATE_FORMAT(${selectedTable}.contract_date, '%Y.%m.%d') AS 날짜,
            CONCAT(${selectedTable}.deposit, '/', ${selectedTable}.monthly_rent) AS 금액, 
            floor AS 층`,
        )
        .where(`${selectedTable}.building_id LIKE :keyword`, {
          keyword: `${houseIdx}`,
        })
        .andWhere(`TRUNCATE(${selectedTable}.contract_area/3.3, 0) = :area`, {
          area,
        })
        .andWhere(
          `${selectedTable}.contract_end_date BETWEEN :startDate AND :endDate`,
          {
            startDate: new Date(`${year}-${month}-01`),
            endDate: new Date(`${year}-${month}-31`),
          },
        )
        .limit(5)
        .getRawMany();
      results[area] = contracts;
    }
    return results;
  }
}
