import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';
/**
 * 抖音订单
 */
@Entity('finance_orders')
export class FinanceOrdersEntity extends BaseEntity {

  @PrimaryGeneratedColumn({ comment: '主键ID' })
  id: number;

  @Column({ comment: '主订单编号', nullable: true, length: 50 })
  main_order_number: string;

  @Column({ comment: '子订单编号', nullable: true, length: 50 })
  sub_order_number: string;

  @Column({ comment: '选购商品', nullable: true, type: 'text' })
  selected_goods: string;

  @Column({ comment: '商品规格', nullable: true, length: 100 })
  product_specification: string;

  @Column({ comment: '商品数量', nullable: true, type: 'int' })
  product_quantity: number;

  @Column({ comment: '商品ID', nullable: true, length: 50 })
  product_id: string;

  @Column({ comment: '商家编码', nullable: true, length: 50 })
  merchant_code: string;

  @Column({
    comment: '商品单价', nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  product_price: number;

  @Column({
    comment: '订单应付金额', nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  order_payable_amount: number;

  @Column({
    comment: '运费', nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,

  })
  shipping_fee: number;

  @Column({
    comment: '优惠总金额', nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,

  })
  total_discount_amount: number;


  @Column({ comment: '平台优惠', nullable: true, length: 150 })
  platform_discount: string;

  @Column({
    comment: '商家优惠', nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,

  })
  merchant_discount: number;

  @Column({
    comment: '达人优惠', nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,

  })
  influencer_discount: number;

  @Column({
    comment: '商家改价', nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,

  })
  merchant_price_adjustment: number;

  @Column({
    comment: '支付优惠', nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,

  })
  payment_discount: number;

  @Column({
    comment: '红包抵扣', nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,

  })
  red_envelope_deduction: number;

  @Column({ comment: '支付方式', nullable: true, length: 50 })
  payment_method: string;

  @Column({
    comment: '手续费', nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,

  })
  transaction_fee: number;

  @Column({ comment: '收件人', nullable: true, length: 600 })
  recipient_name: string;

  @Column({ comment: '收件人手机号', nullable: true, length: 600 })
  recipient_phone_number: string;

  @Column({ comment: '省', nullable: true, length: 50 })
  province: string;

  @Column({ comment: '市', nullable: true, length: 50 })
  city: string;

  @Column({ comment: '区', nullable: true, length: 50 })
  district: string;

  @Column({ comment: '街道', nullable: true, length: 100 })
  street: string;

  @Column({ comment: '详细地址', nullable: true, length: 855 })
  detailed_address: string;

  @Column({ comment: '是否修改过地址', nullable: true, length: 50 })
  is_address_modified: string;

  @Column({ comment: '买家留言', nullable: true, type: 'text' })
  buyer_message: string;

  @Column({ comment: '订单提交时间', nullable: true, type: 'timestamp' })
  order_submission_time: Date;

  @Column({ comment: '旗帜颜色', nullable: true, length: 20 })
  flag_color: string;

  @Column({ comment: '商家备注', nullable: true, type: 'text' })
  merchant_remark: string;

  @Column({ comment: '订单完成时间', nullable: true, type: 'timestamp' })
  order_completion_time: Date;

  @Column({ comment: '支付完成时间', nullable: true, type: 'timestamp' })
  payment_completion_time: Date;

  @Column({ comment: 'APP渠道', nullable: true, length: 50 })
  app_channel: string;

  @Column({ comment: '流量来源', nullable: true, length: 50 })
  traffic_source: string;

  @Column({ comment: '订单状态', nullable: true, length: 50 })
  order_status: string;

  @Column({ comment: '承诺发货时间', nullable: true, type: 'timestamp' })
  promised_delivery_time: Date;

  @Column({ comment: '订单类型', nullable: true, length: 50 })
  order_type: string;

  @Column({ comment: '鲁班落地页ID', nullable: true, length: 50 })
  luban_page_id: string;

  @Column({ comment: '达人ID', nullable: true, length: 50 })
  influencer_id: string;

  @Column({ comment: '达人昵称', nullable: true, length: 50 })
  influencer_nickname: string;

  @Column({ comment: '所属门店ID', nullable: true, length: 50 })
  store_id: string;

  @Column({ comment: '售后状态', nullable: true, length: 50 })
  after_sales_status: string;

  @Column({ comment: '取消原因', nullable: true, type: 'text' })
  cancellation_reason: string;

  @Column({ comment: '预约发货时间', nullable: true, type: 'timestamp' })
  scheduled_delivery_time: Date;

  @Column({ comment: '仓库ID', nullable: true, length: 50 })
  warehouse_id: string;

  @Column({ comment: '仓库名称', nullable: true, length: 100 })
  warehouse_name: string;

  @Column({ comment: '是否安心购', nullable: true, length: 100 })
  is_safe_purchase: string;

  @Column({ comment: '广告渠道', nullable: true, length: 50 })
  ad_channel: string;

  @Column({ comment: '流量类型', nullable: true, length: 50 })
  traffic_type: string;

  @Column({ comment: '流量体裁', nullable: true, length: 50 })
  traffic_format: string;

  @Column({ comment: '流量渠道', nullable: true, length: 50 })
  traffic_channel: string;

  @Column({ comment: '发货主体', nullable: true, length: 100 })
  delivery_entity: string;

  @Column({ comment: '发货主体明细', nullable: true, type: 'text' })
  delivery_entity_details: string;

  @Column({ comment: '发货时间', nullable: true, type: 'timestamp' })
  delivery_time: Date;

  @Column({
    comment: '降价类优惠', nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,

  })
  price_reduction_discount: number;

  @Column({
    comment: '平台实际承担优惠金额', nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,

  })
  platform_actual_discount: number;

  @Column({
    comment: '商家实际承担优惠金额', nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,

  })
  merchant_actual_discount: number;

  @Column({
    comment: '达人实际承担优惠金额', nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,

  })
  influencer_actual_discount: number;

  @Column({ comment: '预计送达时间', nullable: true, type: 'timestamp' })
  estimated_delivery_time: Date;

  @Column({
    comment: '是否平台仓自流转', nullable: true, length: 50
  })
  is_platform_warehouse_auto_transfer: string;

  @Column({ comment: '车型', nullable: true, length: 50 })
  vehicle_type: string;

  @Column({ comment: '预约送达时间', nullable: true, type: 'timestamp' })
  scheduled_delivery_arrival_time: Date;

  @Column({ comment: '建议发货时间（起）', nullable: true, type: 'timestamp' })
  suggested_delivery_start_time: Date;

  @Column({ comment: '建议发货时间（止）', nullable: true, type: 'timestamp' })
  suggested_delivery_end_time: Date;
}