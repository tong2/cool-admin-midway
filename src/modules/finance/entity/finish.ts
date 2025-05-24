import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 完成表
 */
@Entity('finance_finish')
export class FinanceFinishEntity extends BaseEntity {

  @PrimaryGeneratedColumn({ comment: '主键ID' })
  id: number;

  @Column({ comment: '数据时间', nullable: false, type: 'timestamp' })
  gen_data_time: Date;

  @Column({ comment: '主订单编号', nullable: true, length: 200 })
  main_order_number: string;

  @Column({ comment: '子订单编号', nullable: true, length: 200 })
  sub_order_number: string;

  @Column({ comment: '选购商品', nullable: true, length: 100 })
  selected_product: string;

  @Column({ comment: '商品规格', nullable: true, length: 100 })
  product_specification: string;

  @Column({ comment: '商品数量', nullable: true, type: 'integer' })
  product_quantity: number;

  @Column({ comment: '商品ID', nullable: true, length: 200 })
  product_id: string;

  @Column({ comment: '商家编码', nullable: true, length: 200 })
  merchant_code: string;

  @Column({ comment: '商品单价', nullable: true, type: 'decimal', precision: 10, scale: 4 })
  product_unit_price: number;

  @Column({ comment: '订单应付金额', nullable: true, type: 'decimal', precision: 10, scale: 4 })
  order_payable_amount: number;

  @Column({ comment: '运费', nullable: true, type: 'decimal', precision: 10, scale: 4 })
  shipping_fee: number;

  @Column({ comment: '优惠总金额', nullable: true, type: 'decimal', precision: 10, scale: 4 })
  total_discount_amount: number;

  @Column({ comment: '平台优惠', nullable: true, length: 100 })
  platform_discount: string;

  @Column({ comment: '商家优惠', nullable: true, type: 'decimal', precision: 10, scale: 4 })
  merchant_discount: number;

  @Column({ comment: '达人优惠', nullable: true, type: 'decimal', precision: 10, scale: 4 })
  talent_discount: number;

  @Column({ comment: '商家改价', nullable: true, type: 'decimal', precision: 10, scale: 4 })
  merchant_price_adjustment: number;

  @Column({ comment: '支付优惠', nullable: true, type: 'decimal', precision: 10, scale: 4 })
  payment_discount: number;

  @Column({ comment: '红包抵扣', nullable: true, type: 'decimal', precision: 10, scale: 4 })
  red_packet_deduction: number;

  @Column({ comment: '支付方式', nullable: true, length: 50 })
  payment_method: string;

  @Column({ comment: '手续费', nullable: true, type: 'decimal', precision: 10, scale: 4 })
  transaction_fee: number;

  @Column({ comment: '收件人', nullable: true, length: 300 })
  recipient_name: string;

  @Column({ comment: '收件人手机号', nullable: true, length: 20 })
  recipient_phone: string;

  @Column({ comment: '省', nullable: true, length: 50 })
  province: string;

  @Column({ comment: '市', nullable: true, length: 50 })
  city: string;

  @Column({ comment: '区', nullable: true, length: 50 })
  district: string;

  @Column({ comment: '街道', nullable: true, length: 100 })
  street: string;

  @Column({ comment: '详细地址', nullable: true, length: 500 })
  detailed_address: string;

  @Column({ comment: '订单提交时间', nullable: true, type: 'datetime' })
  order_submission_time: Date;

  @Column({ comment: '旗帜颜色', nullable: true, length: 20 })
  flag_color: string;

  @Column({ comment: '商家备注', nullable: true, type: 'text' })
  merchant_remark: string;

  @Column({ comment: '支付完成时间', nullable: true, type: 'datetime' })
  payment_completion_time: Date;

  @Column({ comment: 'APP渠道', nullable: true, length: 50 })
  app_channel: string;

  @Column({ comment: '流量来源', nullable: true, length: 50 })
  traffic_source: string;

  @Column({ comment: '订单状态', nullable: true, length: 50 })
  order_status: string;

  @Column({ comment: '承诺发货时间', nullable: true, type: 'datetime' })
  promised_shipping_time: Date;

  @Column({ comment: '订单类型', nullable: true, length: 50 })
  order_type: string;

  @Column({ comment: '鲁班落地页ID', nullable: true, length: 200 })
  luban_landing_page_id: string;

  @Column({ comment: '达人ID', nullable: true, length: 200 })
  talent_id: string;

  @Column({ comment: '达人昵称', nullable: true, length: 50 })
  talent_nickname: string;

  @Column({ comment: '所属门店ID', nullable: true, length: 200 })
  store_id: string;

  @Column({ comment: '售后状态', nullable: true, length: 50 })
  after_sales_status: string;

  @Column({ comment: '取消原因', nullable: true, length: 100 })
  cancellation_reason: string;

  @Column({ comment: '预约发货时间', nullable: true, type: 'datetime' })
  scheduled_shipping_time: Date;

  @Column({ comment: '仓库ID', nullable: true, length: 200 })
  warehouse_id: string;

  @Column({ comment: '仓库名称', nullable: true, length: 100 })
  warehouse_name: string;

  @Column({ comment: '是否安心购', nullable: true, length: 50 })
  is_secure_purchase: string;

  @Column({ comment: '广告渠道', nullable: true, length: 50 })
  ad_channel: string;

  @Column({ comment: '流量类型', nullable: true, length: 50 })
  traffic_type: string;

  @Column({ comment: '流量体裁', nullable: true, length: 50 })
  traffic_format: string;

  @Column({ comment: '流量渠道', nullable: true, length: 50 })
  traffic_channel: string;

  @Column({ comment: '发货主体', nullable: true, length: 50 })
  shipping_entity: string;

  @Column({ comment: '发货主体明细', nullable: true, length: 100 })
  shipping_entity_details: string;

  @Column({ comment: '发货时间', nullable: true, type: 'datetime' })
  shipping_time: Date;

  @Column({ comment: '降价类优惠', nullable: true, type: 'decimal', precision: 10, scale: 4 })
  price_reduction_discount: number;

  @Column({ comment: '平台实际承担优惠金额', nullable: true, type: 'decimal', precision: 10, scale: 4 })
  platform_actual_discount: number;

  @Column({ comment: '商家实际承担优惠金额', nullable: true, type: 'decimal', precision: 10, scale: 4 })
  merchant_actual_discount: number;

  @Column({ comment: '达人实际承担优惠金额', nullable: true, type: 'decimal', precision: 10, scale: 4 })
  talent_actual_discount: number;

  @Column({ comment: '预计送达时间', nullable: true, type: 'datetime' })
  estimated_delivery_time: Date;

  @Column({ comment: '是否平台仓自流转', nullable: true, length: 100 })
  is_platform_warehouse_transfer: string;

  @Column({ comment: '车型', nullable: true, length: 50 })
  vehicle_type: string;

  @Column({ comment: '商品69码', nullable: true, length: 50 })
  product69_code: string;

  @Column({ comment: '发货SN码', nullable: true, length: 50 })
  shipping_sn_code: string;

  @Column({ comment: '发货IMEI码1', nullable: true, length: 50 })
  shipping_imei_code_1: string;

  @Column({ comment: '发货IMEI码2', nullable: true, length: 50 })
  shipping_imei_code_2: string;

  @Column({ comment: '预约送达时间', nullable: true, type: 'datetime' })
  scheduled_delivery_time: Date;

  @Column({ comment: '建议发货时间（起）', nullable: true, type: 'datetime' })
  suggested_shipping_start: Date;

  @Column({ comment: '建议发货时间（止）', nullable: true, type: 'datetime' })
  suggested_shipping_end: Date;

  @Column({ comment: '物流SN码', nullable: true, length: 50 })
  logistics_sn_code: string;

  @Column({ comment: '物流IMEI码1', nullable: true, length: 50 })
  logistics_imei_code_1: string;

  @Column({ comment: '物流IMEI码2', nullable: true, length: 50 })
  logistics_imei_code_2: string;

  @Column({ comment: '交易时间', nullable: true, type: 'datetime' })
  transaction_time: Date;

  @Column({ comment: '单位成本', nullable: true, type: 'decimal', precision: 10, scale: 4 })
  unit_cost: number;

  @Column({ comment: '订单数量', nullable: true, type: 'integer' })
  order_quantity: number;

  @Column({ comment: '成本', nullable: true, type: 'decimal', precision: 10, scale: 4 })
  total_cost: number;

  @Column({ comment: '重量', nullable: true, type: 'decimal', precision: 10, scale: 4 })
  weight: number;

  @Column({ comment: '省份', nullable: true, length: 50 })
  province_2: string;

  @Column({ comment: '快递费', nullable: true, type: 'decimal', precision: 10, scale: 4 })
  express_fee: number;

  @Column({ comment: '操作费', nullable: true, type: 'decimal', precision: 10, scale: 4 })
  operation_fee: number;

  @Column({ comment: '平台服务费', nullable: true, type: 'decimal', precision: 10, scale: 4 })
  platform_service_fee: number;

  @Column({ comment: '仓库', nullable: true, length: 100 })
  warehouse_2: string;

  @Column({ comment: '状态', nullable: true, length: 50 })
  status: string;

  @Column({ comment: 'erp成本', nullable: true, type: 'decimal', precision: 10, scale: 4 })
  erp_cost: number;

  @Column({ comment: 'erp快递费', nullable: true, type: 'decimal', precision: 10, scale: 4 })
  erp_express_fee: number;

}