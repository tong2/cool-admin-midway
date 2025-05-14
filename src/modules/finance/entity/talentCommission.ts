import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 达人佣金表
 */
@Entity('finance_talent_commission')
export class FinanceTalentCommissionEntity extends BaseEntity {

  @PrimaryGeneratedColumn({ comment: '主键ID' })
  id: number;

  @Column({ comment: '生效时间', nullable: true, type: 'timestamp' })
  effect_time: Date;

  @Column({ comment: '订单id', nullable: true, length: 50 })
  order_id: string;

  @Column({ comment: '商品id', nullable: true, length: 50 })
  product_id: string;

  @Column({ comment: '商品名称', nullable: true, length: 100 })
  product_name: string;

  @Column({ comment: '作者账号', nullable: true, length: 50 })
  author_account: string;

  @Column({ comment: '抖音/火山号', nullable: true, length: 50 })
  douyin_huoshan_id: string;

  @Column({
    comment: '支付金额',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  payment_amount: number;

  @Column({
    comment: '佣金率',
    nullable: true,
    type: 'decimal',
    precision: 5,
    scale: 2,
    
  })
  commission_rate: number;

  @Column({
    comment: '预估佣金支出',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  estimated_commission: number;

  @Column({
    comment: '结算金额',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  settled_amount: number;

  @Column({
    comment: '实际佣金支出',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  actual_commission: number;

  @Column({ comment: '订单状态', nullable: true, length: 50 })
  order_status: string;

  @Column({ comment: '超时未结算原因', nullable: true, type: 'text' })
  unsettled_reason: string;

  @Column({ comment: '付款时间', nullable: true, type: 'timestamp' })
  payment_time: Date;

  @Column({ comment: '收货时间', nullable: true, type: 'timestamp' })
  receipt_time: Date;

  @Column({ comment: '订单结算时间', nullable: true, type: 'timestamp' })
  order_settlement_time: Date;

  @Column({ comment: '商品来源', nullable: true, type: 'text' })
  product_source: string;

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

  @Column({ comment: '佣金发票', nullable: true, length: 100 })
  commission_invoice: string;

  @Column({
    comment: '冻结比例',
    nullable: true,
    type: 'decimal',
    precision: 5,
    scale: 2,
    
  })
  freeze_ratio: number;

  @Column({ comment: '是否阶梯佣金', nullable: true, length: 50 })
  is_tiered_commission: string;

  @Column({ comment: '门槛销量', nullable: true, type: 'int' })
  threshold_sales: number;

  @Column({
    comment: '基础佣金率',
    nullable: true,
    type: 'decimal',
    precision: 5,
    scale: 2,
    
  })
  base_commission_rate: number;

  @Column({
    comment: '升佣佣金率',
    nullable: true,
    type: 'decimal',
    precision: 5,
    scale: 2,
    
  })
  increased_commission_rate: number;

  @Column({
    comment: '预估奖励佣金支出',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  estimated_bonus_commission: number;

  @Column({
    comment: '结算奖励佣金支出',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  settled_bonus_commission: number;

  @Column({ comment: '阶梯计划ID', nullable: true, length: 50 })
  tiered_plan_id: string;

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

  @Column({ comment: '分销来源', nullable: true, length: 50 })
  distribution_source: string;

  @Column({ comment: '营销活动id', nullable: true, length: 50 })
  marketing_activity_id: string;

  @Column({
    comment: '推广费率',
    nullable: true,
    type: 'decimal',
    precision: 5,
    scale: 2,
    
  })
  promotion_rate: number;

  @Column({
    comment: '推广技术服务费',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  promotion_tech_service_fee: number;

  @Column({
    comment: '预估推广费支出',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  estimated_promotion_fee: number;

  @Column({
    comment: '结算推广费支出',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  settled_promotion_fee: number;

  @Column({ comment: '计划类型', nullable: true, length: 50 })
  plan_type: string;

  @Column({ comment: '订单来源', nullable: true, length: 50 })
  order_source: string;

  @Column({ comment: '流量细分来源', nullable: true, length: 50 })
  traffic_segment_source: string;

  @Column({ comment: '流量来源', nullable: true, length: 50 })
  traffic_source: string;

  @Column({ comment: '订单类型', nullable: true, length: 50 })
  order_type: string;

}