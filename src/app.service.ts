import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Like,
  Not,
  Repository,
  FindManyOptions,
  Equal,
  Between,
} from 'typeorm';
import {
  AdministrativeDivisionInfo,
  DetachedHouseRent,
  OffiRent,
  ApartmentRent,
} from './entity/app.entity';

const year = 2023;

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(AdministrativeDivisionInfo)
    private administrativeDivisionInfoRepository: Repository<AdministrativeDivisionInfo>,
    @InjectRepository(DetachedHouseRent)
    private detachedHouseRentRepository: Repository<DetachedHouseRent>,
    @InjectRepository(ApartmentRent)
    private apartmentRentRepository: Repository<ApartmentRent>,
    @InjectRepository(OffiRent)
    private offiRentRepository: Repository<OffiRent>,
  ) {
    this.administrativeDivisionInfoRepository =
      administrativeDivisionInfoRepository;
    this.detachedHouseRentRepository = detachedHouseRentRepository;
    this.apartmentRentRepository = apartmentRentRepository;
    this.offiRentRepository = offiRentRepository;
  }

  async getDongList(): Promise<any> {
    const result = await this.administrativeDivisionInfoRepository.find();
    return result;
  }

  async getHouseDongData(
    houseType: string,
    location: string,
    month: number,
    charterRent: string,
  ): Promise<any> {
    const options: FindManyOptions = {
      where: {
        dong: location === '진주시' ? Not(Like('%리')) : location,
        contract_end_date: Between(
          new Date(`${year}-${month}-01`),
          new Date(`${year}-${month}-31`),
        ),
      },
    };
    if (charterRent == '월세') {
      options.where['monthly_rent'] = Not(Equal(0));
    } else if (charterRent == '전세') {
      options.where['monthly_rent'] = Equal(0);
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
      전세데이터.forEach(({ dong }) => {
        if (!result[dong]) {
          result[dong] = { 합계: 0, 전세: 0, 월세: 0 };
        }
        result[dong].전세 += 1;
        result[dong].합계 += 1;
      });

      월세데이터.forEach(({ dong }) => {
        if (!result[dong]) {
          result[dong] = { 합계: 0, 전세: 0, 월세: 0 };
        }
        result[dong].월세 += 1;
        result[dong].합계 += 1;
      });
    }

    return result;
  }
}
