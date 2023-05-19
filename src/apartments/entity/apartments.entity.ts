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
}

@Entity({ name: 'OffiRent' })
export class OffiRent extends Rent {
  @Column({ name: '단지ID' })
  단지ID: number;

  @Column()
  층: number;

  @Column()
  전용면적: number;
}

@Entity({ name: 'OffiInfo' })
export class HouseInfo {
  @PrimaryGeneratedColumn({ name: 'ComplexID' })
  ComplexID: number;

  @Column({ name: 'Province' })
  Province: string;

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
