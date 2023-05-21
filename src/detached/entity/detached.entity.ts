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

@Entity({ name: 'DetachedHouseRent' })
export class DetachedHouseRent extends Rent {
  @Column()
  계약면적: number;
}