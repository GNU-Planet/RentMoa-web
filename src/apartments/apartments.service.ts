import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ApartmentInfo,
  ApartmentRent,
  OffiRent,
  OffiInfo,
  RowHouseInfo,
  RowHouseRent,
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
    @InjectRepository(RowHouseInfo)
    private readonly rowHouseInfoRepository: Repository<RowHouseInfo>,
    @InjectRepository(RowHouseRent)
    private readonly rowHouseRentRepository: Repository<RowHouseRent>,
  ) {
    this.apartmentRentRepository = apartmentRentRepository;
    this.apartmentInfoRepository = apartmentInfoRepository;
    this.offiRentRepository = offiRentRepository;
    this.offiInfoRepository = offiInfoRepository;
    this.rowHouseInfoRepository = rowHouseInfoRepository;
    this.rowHouseRentRepository = rowHouseRentRepository;
  }

  async getApartmentsLocations(houseType: string): Promise<any> {
    let repository;

    if (houseType === '아파트') {
      repository = this.apartmentInfoRepository;
    } else if (houseType === '오피스텔') {
      repository = this.offiInfoRepository;
    } else if (houseType === '연립다세대') {
      repository = this.rowHouseInfoRepository;
    }

    return await repository.find();
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

    if (charterRent === '월세') {
      options.where['monthly_rent'] = Not(Equal(0));
    } else if (charterRent === '전세') {
      options.where['monthly_rent'] = Equal(0);
    }

    let repository;

    if (houseType === '아파트') {
      repository = this.apartmentRentRepository;
    } else if (houseType === '오피스텔') {
      repository = this.offiRentRepository;
    } else if (houseType === '연립다세대') {
      repository = this.rowHouseRentRepository;
    }

    return await repository.find(options);
  }

  async getPredictedAmountByHouse(
    houseType: string,
    houseIdx: number,
    months: Array<number>,
  ) {
    const result = { 합계: 0, 전세: 0, 월세: 0 };
    ``;

    for (const 계약종료월 of months) {
      const [전세데이터, 월세데이터] = await Promise.all([
        this.getHouseDetailData(houseType, houseIdx, 계약종료월, '전세'),
        this.getHouseDetailData(houseType, houseIdx, 계약종료월, '월세'),
      ]);

      result.전세 += 전세데이터.length;
      result.월세 += 월세데이터.length;
      result.합계 += 전세데이터.length + 월세데이터.length;
    }

    return result;
  }

  async getAreaList(houseType: string, houseIdx: number) {
    let selectedRepository, selectedTable;

    if (houseType === '아파트') {
      selectedRepository = this.apartmentRentRepository;
      selectedTable = 'apartment_contract';
    } else if (houseType === '오피스텔') {
      selectedRepository = this.offiRentRepository;
      selectedTable = 'offi_contract';
    } else if (houseType === '연립다세대') {
      selectedRepository = this.rowHouseRentRepository;
      selectedTable = 'row_house_contract';
    }

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

    return areas.map((areas) => areas.contract_area);
  }

  async getPredictedAmountByHouseArea(
    houseType: string,
    houseIdx: number,
    area: number,
    month: number,
    charterRent: string,
  ) {
    const results = {};
    const areasArray = area
      ? [area]
      : await this.getAreaList(houseType, houseIdx);
    let selectedRepository, selectedTable;

    if (houseType === '아파트') {
      selectedRepository = this.apartmentRentRepository;
      selectedTable = 'apartment_contract';
    } else if (houseType === '오피스텔') {
      selectedRepository = this.offiRentRepository;
      selectedTable = 'offi_contract';
    } else if (houseType === '연립다세대') {
      selectedRepository = this.rowHouseRentRepository;
      selectedTable = 'row_house_contract';
    }

    for (const area of areasArray) {
      const contracts = await selectedRepository
        .createQueryBuilder(selectedTable)
        .select(
          `DATE_FORMAT(${selectedTable}.contract_date, '%Y.%m.%d') AS contract_start_date,
          DATE_FORMAT(${selectedTable}.contract_end_date, '%Y.%m.%d') AS contract_end_date,
          contract_type,
          ${
            charterRent === '전세'
              ? `${selectedTable}.deposit`
              : `CONCAT(${selectedTable}.deposit, '/', ${selectedTable}.monthly_rent)`
          } AS price,
            floor`,
        )
        .where(`${selectedTable}.building_id LIKE :keyword`, {
          keyword: `${houseIdx}`,
        })
        .andWhere(`TRUNCATE(${selectedTable}.contract_area/3.3, 0) = :area`, {
          area,
        });

      if (charterRent === '월세') {
        contracts.andWhere(`${selectedTable}.monthly_rent != 0`);
      } else if (charterRent === '전세') {
        contracts.andWhere(`${selectedTable}.monthly_rent = 0`);
      }

      contracts.orderBy(`${selectedTable}.contract_date`, 'DESC');

      results[area] = await contracts.getRawMany();
    }

    return results;
  }
}
