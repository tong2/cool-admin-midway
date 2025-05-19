import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * ERP订单
 */
@Entity('finance_erp_orders')
export class FinanceErpOrdersEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ comment: '主键ID' })
  id: number;

  @Column({ comment: '数据时间', nullable: true, type: 'timestamp' })
  data_time: Date;

  @Column({ comment: '订单编号', nullable: true, length: 50 })
  order_number: string;

  @Column({ comment: '平台类型', nullable: true, length: 50 })
  platform_type: string;

  @Column({ comment: '店铺名称', nullable: true, length: 100 })
  shop_name: string;

  @Column({ comment: '订单来源', nullable: true, length: 50 })
  order_source: string;

  @Column({ comment: '仓库名称', nullable: true, length: 100 })
  warehouse_name: string;

  @Column({ comment: '仓库类型', nullable: true, length: 50 })
  warehouse_type: string;

  @Column({ comment: '原始单号', nullable: true, length: 50 })
  original_order_no: string;

  @Column({ comment: '订单状态', nullable: true, length: 50 })
  order_status: string;

  @Column({ comment: '发货状态', nullable: true, length: 50 })
  shipping_status: string;

  @Column({ comment: '平台发货状态', nullable: true, length: 50 })
  platform_shipping_status: string;

  @Column({ comment: '订单类型', nullable: true, length: 50 })
  order_type: string;

  @Column({ comment: '发货条件', nullable: true, length: 50 })
  shipping_condition: string;

  @Column({ comment: '冻结原因', nullable: true, length: 100 })
  freeze_reason: string;

  @Column({ comment: '退款状态', nullable: true, length: 50 })
  refund_status: string;

  @Column({ comment: '分销类别', nullable: true, length: 50 })
  distribution_category: string;

  @Column({ comment: '分销商名称', nullable: true, length: 100 })
  distributor_name: string;

  @Column({ comment: '分销商编号', nullable: true, length: 50 })
  distributor_code: string;

  @Column({ comment: '分销原始单号', nullable: true, length: 50 })
  distribution_original_order_no: string;

  @Column({ comment: '下单时间', nullable: true, type: 'timestamp' })
  order_time: Date;

  @Column({ comment: '付款时间', nullable: true, type: 'timestamp' })
  payment_time: Date;

  @Column({ comment: '发货倒计时', nullable: true, length: 100 })
  shipping_countdown: string;

  @Column({ comment: '买家付款账号', nullable: true, length: 100 })
  buyer_payment_account: string;

  @Column({ comment: '客户网名', nullable: true, length: 100 })
  customer_nickname: string;

  @Column({ comment: '收件人', nullable: true, length: 100 })
  recipient_name: string;

  @Column({ comment: '省市县', nullable: true, length: 100 })
  province_city_county: string;

  @Column({ comment: '地址', nullable: true, length: 255 })
  address: string;

  @Column({ comment: '手机', nullable: true, length: 20 })
  mobile_phone: string;

  @Column({ comment: '电话', nullable: true, length: 20 })
  telephone: string;

  @Column({ comment: '邮编', nullable: true, length: 20 })
  postcode: string;

  @Column({ comment: '区域', nullable: true, length: 100 })
  area: string;

  @Column({ comment: '大头笔', nullable: true, length: 100 })
  big_pen: string;

  @Column({ comment: '派送时间', nullable: true, type: 'timestamp' })
  dispatch_time: Date;

  @Column({ comment: '物流公司', nullable: true, length: 100 })
  logistics_company: string;

  @Column({ comment: '物流单号', nullable: true, length: 50 })
  logistics_number: string;

  @Column({ comment: '买家留言', nullable: true, type: 'text' })
  buyer_message: string;

  @Column({ comment: '客服备注', nullable: true, type: 'text' })
  customer_service_remark: string;

  @Column({ comment: '标旗', nullable: true, length: 20 })
  flag: string;

  @Column({ comment: '打印备注', nullable: true, type: 'text' })
  print_remark: string;

  @Column({ comment: '货品种类数', nullable: true, type: 'int' })
  product_variety_count: number;

  @Column({ comment: '货品总数', nullable: true, type: 'int' })
  product_total_count: number;

  @Column({
    comment: '货品总额',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  product_total_amount: number;

  @Column({
    comment: '邮资',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  shipping_fee: number;

  @Column({
    comment: '其它费用',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  other_fees: number;

  @Column({
    comment: '优惠',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  discount: number;

  @Column({
    comment: '应收金额',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  receivable_amount: number;

  @Column({
    comment: '销项税',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  output_tax: number;

  @Column({
    comment: '款到发货金额',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  payment_on_delivery_amount: number;

  @Column({
    comment: 'COD金额',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  cod_amount: number;

  @Column({
    comment: '买家COD费用',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  buyer_cod_fee: number;

  @Column({
    comment: '佣金',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  commission: number;

  @Column({
    comment: '货品预估成本',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  product_estimated_cost: number;

  @Column({
    comment: '邮资预估成本',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  shipping_estimated_cost: number;

  @Column({
    comment: '已付金额',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  paid_amount: number;

  @Column({
    comment: '预估重量',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  estimated_weight: number;

  @Column({
    comment: '预估毛利',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  estimated_gross_profit: number;

  @Column({ comment: '发票类型', nullable: true, length: 50 })
  invoice_type: string;

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

  @Column({ comment: '签出人', nullable: true, length: 100 })
  sign_out_person: string;

  @Column({ comment: '出库单号', nullable: true, length: 50 })
  outbound_order_no: string;

  @Column({ comment: '标记名称', nullable: true, length: 50 })
  mark_name: string;

  @Column({ comment: '处理天数', nullable: true, type: 'int' })
  processing_days: number;

  @Column({ comment: '货品商家编码', nullable: true, length: 50 })
  product_merchant_code: string;

  @Column({ comment: '原始货品数量', nullable: true, type: 'int' })
  original_product_quantity: number;

  @Column({ comment: '原始货品种类数', nullable: true, type: 'int' })
  original_product_variety_count: number;

  @Column({ comment: '递交时间', nullable: true, type: 'timestamp' })
  submission_time: Date;

  @Column({ comment: '币种', nullable: true, length: 20 })
  currency: string;

  @Column({ comment: '线上包裹拆分数', nullable: true, type: 'int' })
  online_package_split_count: number;

  @Column({ comment: '激活时间', nullable: true, type: 'timestamp' })
  activation_time: Date;

  @Column({ comment: '已开具发票', nullable: true, length: 50, default: 'false' })
  invoice_issued: string;

  @Column({
    comment: '体积',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  volume: number;

  @Column({ comment: '订单标签', nullable: true, type: 'text' })
  order_tags: string;

  @Column({ comment: '订单异常', nullable: true, length: 100 })
  order_exception: string;

  @Column({ comment: '便签', nullable: true, type: 'text' })
  note: string;

  @Column({ comment: '证件号码', nullable: true, length: 50 })
  id_number: string;

  @Column({
    comment: '买家实付',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  buyer_actual_payment: number;

  @Column({ comment: '最晚送达时间', nullable: true, type: 'timestamp' })
  latest_delivery_time: Date;

  @Column({ comment: '平台标签', nullable: true, type: 'text' })
  platform_tags: string;
}