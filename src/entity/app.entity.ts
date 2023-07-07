import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'administrative_division_info' })
export class AdministrativeDivisionInfo {
  @PrimaryGeneratedColumn()
  id: number; // id

  @Column()
  dong: string; // 법정동

  @Column('double')
  dong_lat: number; // 법정동 위도

  @Column('double')
  dong_lng: number; // 법정동 경도
}

@Entity({ name: 'rent_info' })
export class RentInfo {
  @PrimaryGeneratedColumn()
  id: number; // id

  @Column()
  dong: string; // 법정동

  @Column()
  building_name: string; // 건물명

  @Column()
  build_year: number; // 건축년도

  @Column('double')
  building_lat: number; // 건물 위도

  @Column('double')
  building_lng: number; // 건물 경도
}

@Entity({ name: 'apartment_info' })
export class ApartmentInfo extends RentInfo {}

@Entity({ name: 'offi_info' })
export class OffiInfo extends RentInfo {
  // 다른 엔티티와의 관계 설정
  @OneToMany(() => OffiRent, (contract) => contract.building)
  contracts: OffiRent[];
}

@Entity({ name: 'rent_contract' })
export class RentContract {
  @PrimaryGeneratedColumn()
  id: number; // id

  @Column()
  dong: string; // 법정동

  @Column()
  contract_date: Date; // 계약년월

  @Column()
  contract_start_date: Date; // 계약시작일

  @Column()
  contract_end_date: Date; // 계약종료일

  @Column()
  contract_area: number; // 계약면적

  @Column()
  deposit: number; // 보증금

  @Column()
  monthly_rent: number; // 월세
}

@Entity({ name: 'detached_house_contract' })
export class DetachedHouseRent extends RentContract {}

@Entity({ name: 'apartment_contract' })
export class ApartmentRent extends RentContract {
  @Column()
  floor: number; // 층
}

@Entity({ name: 'offi_contract' })
export class OffiRent extends RentContract {
  @Column()
  building_id: number;

  // 외래 키 관계 설정
  @ManyToOne(() => OffiInfo, (info) => info.contracts)
  @JoinColumn({ name: 'building_id' })
  building: OffiInfo;

  @Column()
  floor: number; // 층
}
