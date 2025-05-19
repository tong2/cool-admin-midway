import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 成本表
 */
@Entity('finance_cost')
export class FinanceCostEntity extends BaseEntity {

  @PrimaryGeneratedColumn({ comment: '主键ID' })
  id: number;

  @Column({ comment: '商家编码', nullable: true, length: 50 })
  merchant_code: string;

  @Column({ comment: '货品编号', nullable: true, length: 50 })
  product_number: string;

  @Column({ comment: '货品名称', nullable: true, length: 100 })
  product_name: string;

  @Column({ comment: '货品简称', nullable: true, length: 50 })
  product_short_name: string;

  @Column({ comment: '分类', nullable: true, length: 50 })
  category: string;

  @Column({ comment: '规格名称', nullable: true, length: 100 })
  specification_name: string;

  @Column({ comment: '单品重量', nullable: true, type: 'decimal', precision: 10, scale: 2 })
  unit_weight: number;

  @Column({ comment: '品牌', nullable: true, length: 50 })
  brand: string;

  @Column({ comment: '成本价', nullable: true, type: 'decimal', precision: 10, scale: 2 })
  cost_price: number;

}