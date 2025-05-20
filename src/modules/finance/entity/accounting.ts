import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 核算表
 */
@Entity('finance_accounting')
export class FinanceAccountingEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ comment: '主键ID' })
  id: number;

  @Column({ comment: '数据时间', nullable: true, type: 'timestamp' })
  data_time: Date;

  @Column({ comment: '子订单编号', nullable: true })
  sub_order_no: string;

  @Column({ comment: '状态', nullable: true })
  status: string;

  @Column({ comment: '仓库', nullable: true })
  warehouse: string;

  @Column({ comment: '交易日期', type: 'datetime', nullable: true })
  trade_date: Date;

  @Column({ comment: '商品ID', nullable: true })
  product_id: string;

  @Column({ comment: '商家编码', nullable: true })
  merchant_code: string;

  @Column({ comment: '订单数量', type: 'int', nullable: true })
  order_quantity: number;

  @Column({ comment: '订单应付金额', type: 'decimal', precision: 10, scale: 4, nullable: true })
  order_payable_amount: number;

  @Column({ comment: '实际平台补贴', type: 'decimal', precision: 10, scale: 4, nullable: true })
  actual_platform_subsidy: number;

  @Column({ comment: '达人实际承担优惠金额', type: 'decimal', precision: 10, scale: 4, nullable: true })
  influencer_discount_amount: number;

  @Column({ comment: '实销', type: 'decimal', precision: 10, scale: 4, nullable: true })
  actual_sales: number;

  @Column({ comment: '平台补贴扣费（2%）', type: 'decimal', precision: 10, scale: 4, nullable: true })
  platform_subsidy_fee: number;

  @Column({ comment: '平台服务费', type: 'decimal', precision: 10, scale: 4, nullable: true })
  platform_service_fee: number;

  @Column({ comment: '达人佣金', type: 'decimal', precision: 10, scale: 4, nullable: true })
  influencer_commission: number;

  @Column({ comment: '团长服务费', type: 'decimal', precision: 10, scale: 4, nullable: true })
  group_leader_service_fee: number;

  @Column({ comment: '成本', type: 'decimal', precision: 10, scale: 4, nullable: true })
  cost: number;

  @Column({ comment: '快递费', type: 'decimal', precision: 10, scale: 4, nullable: true })
  shipping_fee: number;

  @Column({ comment: '操作费', type: 'decimal', precision: 10, scale: 4, nullable: true })
  operation_fee: number;

  @Column({ comment: '利润', type: 'decimal', precision: 10, scale: 4, nullable: true })
  profit: number;

  @Column({ comment: '毛利率', type: 'decimal', precision: 5, scale: 4, nullable: true })
  gross_margin: number;
}