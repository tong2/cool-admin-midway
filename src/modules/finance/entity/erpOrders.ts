import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * ERP订单
 */
@Entity('finance_erp_orders')
export class FinanceErpOrdersEntity extends BaseEntity {

  @PrimaryGeneratedColumn({ comment: '主键ID' })
  id: number;

  @Column({ comment: '订单编号', nullable: true, length: 50 })
  order_number: string;

  @Column({ comment: '店铺', nullable: true, length: 100 })
  shop: string;

  @Column({ comment: '订单来源', nullable: true, length: 50 })
  order_source: string;

  @Column({ comment: '仓库', nullable: true, length: 100 })
  warehouse: string;

  @Column({ comment: '子单原始单号', nullable: true, length: 50 })
  sub_order_original_number: string;

  @Column({
    comment: '订单状态',
    nullable: true,
    length: 50
  })
  order_status: string;

  @Column({ comment: '订单类型', nullable: true, length: 50 })
  order_type: string;

  @Column({ comment: '货到付款', nullable: true, length: 50, default: 'false' })
  cash_on_delivery: string;

  @Column({ comment: '订单退款状态', nullable: true, length: 50 })
  order_refund_status: string;

  @Column({ comment: '交易时间', nullable: true, type: 'timestamp' })
  transaction_time: Date;

  @Column({ comment: '付款时间', nullable: true, type: 'timestamp' })
  payment_time: Date;

  @Column({ comment: '发货时间', nullable: true, type: 'timestamp' })
  delivery_time: Date;

  @Column({ comment: '客户网名', nullable: true, length: 100 })
  customer_nickname: string;

  @Column({ comment: '收件人', nullable: true, length: 100 })
  recipient_name: string;

  @Column({ comment: '收货地区', nullable: true, length: 100 })
  recipient_region: string;

  @Column({ comment: '收货地址', nullable: true, length: 255 })
  recipient_address: string;

  @Column({ comment: '收件人手机', nullable: true, length: 20 })
  recipient_phone: string;

  @Column({ comment: '分销商', nullable: true, length: 100 })
  distributor: string;

  @Column({ comment: '子单原始子单号', nullable: true, length: 50 })
  sub_order_original_sub_number: string;

  @Column({ comment: '来源组合装编号', nullable: true, length: 50 })
  source_bundle_number: string;

  @Column({ comment: '客户编号', nullable: true, length: 50 })
  customer_number: string;

  @Column({ comment: '收件人电话', nullable: true, length: 20 })
  recipient_telephone: string;

  @Column({ comment: '邮编', nullable: true, length: 20 })
  postcode: string;

  @Column({ comment: '区域', nullable: true, length: 100 })
  area: string;

  @Column({ comment: '物流公司', nullable: true, length: 100 })
  logistics_company: string;

  @Column({ comment: '物流单号', nullable: true, length: 50 })
  logistics_number: string;

  @Column({ comment: '买家留言', nullable: true, type: 'text' })
  buyer_message: string;

  @Column({ comment: '客服备注', nullable: true, type: 'text' })
  customer_service_remark: string;

  @Column({ comment: '打印备注', nullable: true, type: 'text' })
  print_remark: string;

  @Column({ comment: '备注', nullable: true, type: 'text' })
  remark: string;

  @Column({ comment: '客服标旗', nullable: true, length: 20 })
  customer_service_flag: string;

  @Column({
    comment: '订单支付金额',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  order_payment_amount: number;

  @Column({
    comment: '邮费',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  postage: number;

  @Column({
    comment: '其它费用',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  other_fees: number;

  @Column({
    comment: '订单总优惠',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  order_total_discount: number;

  @Column({
    comment: '应收金额',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  receivable_amount: number;

  @Column({
    comment: '款到发货金额',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  payment_on_delivery_amount: number;

  @Column({
    comment: '货到付款金额',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  cash_on_delivery_amount: number;

  @Column({
    comment: '订单预估成本',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  order_estimated_cost: number;

  @Column({
    comment: '邮资成本',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  postage_cost: number;

  @Column({
    comment: '预估重量',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  estimated_weight: number;

  @Column({ comment: '需要发票', nullable: true, length: 50, default: 'false' })
  need_invoice: string;

  @Column({ comment: '发票抬头', nullable: true, length: 100 })
  invoice_title: string;

  @Column({ comment: '发票内容', nullable: true, type: 'text' })
  invoice_content: string;

  @Column({ comment: '业务员', nullable: true, length: 100 })
  salesman: string;

  @Column({ comment: '审核人', nullable: true, length: 100 })
  auditor: string;

  @Column({ comment: '财审人', nullable: true, length: 100 })
  financial_auditor: string;

  @Column({ comment: '商家编码', nullable: true, length: 50 })
  merchant_code: string;

  @Column({ comment: '货品编号', nullable: true, length: 50 })
  product_number: string;

  @Column({ comment: '货品名称', nullable: true, length: 100 })
  product_name: string;

  @Column({ comment: '规格名称', nullable: true, length: 100 })
  specification_name: string;

  @Column({ comment: '货品简称', nullable: true, length: 50 })
  product_short_name: string;

  @Column({ comment: '基本单位', nullable: true, length: 50 })
  base_unit: string;

  @Column({ comment: '平台货品名称', nullable: true, length: 100 })
  platform_product_name: string;

  @Column({ comment: '平台规格名称', nullable: true, length: 100 })
  platform_specification_name: string;

  @Column({ comment: '平台货品ID', nullable: true, length: 50 })
  platform_product_id: string;

  @Column({ comment: '平台规格ID', nullable: true, length: 50 })
  platform_specification_id: string;

  @Column({ comment: '下单数量', nullable: true, type: 'int' })
  order_quantity: number;

  @Column({
    comment: '标价',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  list_price: number;

  @Column({
    comment: '货品总优惠',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  product_total_discount: number;

  @Column({
    comment: '成交价',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  transaction_price: number;

  @Column({
    comment: '分摊后价格',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  apportioned_price: number;

  @Column({
    comment: '折扣',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  discount: number;

  @Column({ comment: '实发数量', nullable: true, type: 'int' })
  actual_delivery_quantity: number;

  @Column({
    comment: '分摊后总价',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  apportioned_total_price: number;

  @Column({
    comment: '退款前支付金额',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  pre_refund_payment_amount: number;

  @Column({
    comment: '分摊邮费',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  apportioned_postage: number;

  @Column({
    comment: '单品支付金额',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  single_item_payment_amount: number;

  @Column({
    comment: '佣金',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  commission: number;

  @Column({ comment: '拆自组合装', nullable: true, length: 50 })
  split_from_bundle: string;

  @Column({
    comment: '估重',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    
  })
  estimated_weight_per_item: number;

  @Column({ comment: '赠品方式', nullable: true, length: 50 })
  gift_method: string;

  @Column({ comment: '证件号码', nullable: true, length: 50 })
  id_number: string;

  @Column({ comment: '标记名称', nullable: true, length: 50 })
  mark_name: string;

  @Column({ comment: '激活时间', nullable: true, type: 'timestamp' })
  activation_time: Date;

  @Column({ comment: '派送时间', nullable: true, type: 'timestamp' })
  dispatch_time: Date;

}