import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 箱规表
 */
@Entity('finance_box_spec')
export class FinanceBoxSpecEntity extends BaseEntity {

  @PrimaryGeneratedColumn({ comment: '主键ID' })
  id: number;

  @Column({ comment: '数据时间', nullable: false, type: 'timestamp' })
  gen_data_time: Date;

  @Column({ comment: '仓库', nullable: false, type: 'varchar' })
  warehouse: string;

  @Column({ comment: '品牌', nullable: false, type: 'varchar' })
  brand: string;

  @Column({ comment: '货号', nullable: false, type: 'varchar' })
  product_number: string;

  @Column({ comment: '箱规', nullable: false, type: 'varchar' })
  box_specification: string;

  @Column({ comment: '规格包/提/条/瓶', nullable: false, type: 'int' })
  unit_specification: number;

  @Column({ comment: '包/提/条/瓶', nullable: false, type: 'varchar' })
  unit_type: string;
}