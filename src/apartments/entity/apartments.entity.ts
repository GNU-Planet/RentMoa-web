import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Rent' })
export class Rent {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column()
  법정동: string;

  @Column()
  년: number;

  @Column()
  월: number;

  @Column()
  계약종료년: number;

  @Column()
  계약종료월: number;

  @Column()
  보증금액: number;

  @Column()
  월세금액: number;

  @Column()
  건축년도: number;
}

@Entity({ name: 'OffiRent' })
export class OffiRent extends Rent {
  @Column()
  층: number;

  @Column()
  단지: string;

  @Column()
  전용면적: number;
}

export class HouseInfo {
  @PrimaryGeneratedColumn({ name: 'ComplexID' })
  ComplexID: number;

  @Column({ name: 'CityDistrict' })
  CityDistrict: string;

  @Column({ name: 'LegalDong' })
  LegalDong: string;

  @Column({ name: 'ComplexAddress' })
  ComplexAddress: string;

  @Column({ name: 'ComplexName' })
  ComplexName: string;

  @Column({ name: 'ComplexLat' })
  ComplexLat: number;

  @Column({ name: 'ComplexLng' })
  ComplexLng: number;
}

@Entity({ name: 'OffiInfo' })
export class OffiInfo extends HouseInfo {}
