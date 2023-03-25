import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'DetachedHouseRent' })
export class DetachedHouseRent {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column()
  법정동: string;

  @Column()
  건축년도: number;

  @Column()
  계약면적: number;
}
