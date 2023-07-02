import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

@Entity({ name: 'detached_house_contract' })
export class DetachedHouseRent {
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

@Entity({ name: 'apartment_contract' })
export class ApartmentRent extends DetachedHouseRent {
  @Column()
  floor: number; // 층
}
