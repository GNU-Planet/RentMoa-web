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

@Entity({ name: 'DetachedHouseRent' })
export class DetachedHouseRent extends Rent {
  @Column()
  계약면적: number;
}

@Entity({ name: 'OffiRent' })
export class OffiRent extends Rent {
  @Column({ name: 'ComplexID' })
  ComplexID: number;

  @Column()
  층: number;

  @Column()
  전용면적: number;
}
