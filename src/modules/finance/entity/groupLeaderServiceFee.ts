import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 团长服务费表
 */
@Entity('finance_group_leader_service_fee')
export class FinanceGroupLeaderServiceFeeEntity extends BaseEntity {

  @PrimaryGeneratedColumn({ comment: '主键ID' })
  id: number;

  @Column({ comment: '订单id', nullable: true, length: 50 })
  order_id: string;

  @Column({ comment: '商品名称', nullable: true, length: 100 })
  product_name: string;

  @Column({ comment: '商品id', nullable: true, length: 50 })
  product_id: string;

  @Column({ comment: '订单状态', nullable: true, length: 50 })
  order_status: string;

  @Column({ comment: '超时未结算原因', nullable: true, type: 'text' })
  unsettled_reason: string;

  @Column({ comment: '出单机构', nullable: true, length: 100 })
  issuing_agency: string;

  @Column({
    comment: '支付金额',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  payment_amount: number;

  @Column({
    comment: '服务费率',
    nullable: true,
    type: 'decimal',
    precision: 5,
    scale: 2,
    
  })
  service_fee_rate: number;

  @Column({
    comment: '预估服务费收入',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  estimated_service_fee_income: number;

  @Column({
    comment: '结算金额',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  settled_amount: number;

  @Column({
    comment: '实际服务费收入',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  actual_service_fee_income: number;

  @Column({ comment: '付款时间', nullable: true, type: 'timestamp' })
  payment_time: Date;

  @Column({ comment: '收货时间', nullable: true, type: 'timestamp' })
  receipt_time: Date;

  @Column({ comment: '结算时间', nullable: true, type: 'timestamp' })
  settlement_time: Date;

  @Column({ comment: '尾款支付时间', nullable: true, type: 'timestamp' })
  final_payment_time: Date;

  @Column({
    comment: '定金金额',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  deposit_amount: number;

  @Column({ comment: '店铺id', nullable: true, length: 50 })
  shop_id: string;

  @Column({ comment: '店铺名称', nullable: true, length: 100 })
  shop_name: string;

  @Column({ comment: '商品数量', nullable: true, type: 'int' })
  product_quantity: number;

  @Column({ comment: '团长活动id', nullable: true, length: 50 })
  group_leader_activity_id: string;

  @Column({ comment: '订单来源:直播', nullable: true, length: 50 })
  order_source: string;

  @Column({
    comment: '支付补贴',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  payment_subsidy: number;

  @Column({
    comment: '平台补贴',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  platform_subsidy: number;

  @Column({
    comment: '达人补贴',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  talent_subsidy: number;

  @Column({
    comment: '运费',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  shipping_fee: number;

  @Column({
    comment: '税费',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  tax_fee: number;

  @Column({
    comment: '运费补贴',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  shipping_subsidy: number;

  @Column({ comment: '计划类型', nullable: true, length: 50 })
  plan_type: string;

  @Column({ comment: '商品来源', nullable: true, type: 'text' })
  product_source: string;

  @Column({ comment: '订单来源:抖音', nullable: true, length: 50 })
  order_source_platform: string;

  @Column({ comment: '订单类型', nullable: true, length: 50 })
  order_type: string;

}