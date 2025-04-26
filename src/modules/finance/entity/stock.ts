import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 库存表
 */
@Entity('finance_stock')
export class FinanceStockEntity extends BaseEntity {

  @PrimaryGeneratedColumn({ comment: '主键ID' })
  id: number;

  @Column({ comment: '商品编码', nullable: true, length: 50 })
  product_code: string;

  @Column({
    comment: '重量',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  weight: number;

  @Column({
    comment: '采购价',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  purchase_price: number;

  @Column({
    comment: '打款价',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  payment_price: number;

  @Column({ comment: '箱规', nullable: true, length: 100 })
  box_specification: string;

  @Column({ comment: '商品数量', nullable: true, type: 'int' })
  product_quantity: number;

  @Column({ comment: '品牌方', nullable: true, length: 100 })
  brand_owner: string;

  @Column({ comment: '供货方', nullable: true, length: 100 })
  supplier: string;

  @Column({ comment: '是否计算返利', nullable: true, length: 50 })
  is_rebate_calculated: string;

  @Column({ comment: '费用1（比例或者总数）', nullable: true, length: 50 })
  fee1: string;

  @Column({ comment: '费用2', nullable: true, length: 50 })
  fee2: string;

  @Column({ comment: '费用3', nullable: true, length: 50 })
  fee3: string;

  @Column({ comment: '费用4', nullable: true, length: 50 })
  fee4: string;

  @Column({ comment: '费用5', nullable: true, length: 50 })
  fee5: string;

  @Column({ comment: '返利', nullable: true, length: 50 })
  rebate: string;

}