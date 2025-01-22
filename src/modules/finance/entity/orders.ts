import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';
/**
 * 财务模块-订单信息
 */
@Entity('finance_orders')
export class FinanceOrdersEntity extends BaseEntity {

  @PrimaryGeneratedColumn({ comment: '主键ID' })
  id: number;

  @Index()
  @Column({ comment: '主订单编号', length: 50 })
  mainOrderNumber: string;

  @Index()
  @Column({ comment: '子订单编号', length: 50 })
  subOrderNumber: string;

  @Column({ comment: '选购商品', type: 'text' })
  selectedGoods: string;

  @Column({ comment: '商品规格', length: 100 })
  productSpecification: string;

  @Column({ comment: '商品数量', type: 'int' })
  productQuantity: number;

  @Column({ comment: '商品ID', length: 50 })
  productId: string;

  @Column({ comment: '商家编码', length: 50 })
  merchantCode: string;

  @Column({
    comment: '商品单价',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  productPrice: number;

  @Column({
    comment: '订单应付金额',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  orderPayableAmount: number;

  @Column({
    comment: '运费',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  shippingFee: number;

  @Column({
    comment: '优惠总金额',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalDiscountAmount: number;

  @Column({
    comment: '平台优惠',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  platformDiscount: number;

  @Column({
    comment: '商家优惠',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  merchantDiscount: number;

  @Column({
    comment: '达人优惠',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  influencerDiscount: number;

  @Column({
    comment: '商家改价',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  merchantPriceAdjustment: number;

  @Column({
    comment: '支付优惠',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  paymentDiscount: number;

  @Column({
    comment: '红包抵扣',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  redEnvelopeDeduction: number;

  @Column({ comment: '支付方式', length: 50 })
  paymentMethod: string;

  @Column({
    comment: '手续费',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  transactionFee: number;

  @Column({ comment: '收件人', length: 100 })
  recipientName: string;

  @Column({ comment: '收件人手机号', length: 20 })
  recipientPhoneNumber: string;

  @Column({ comment: '省', length: 50 })
  province: string;

  @Column({ comment: '市', length: 50 })
  city: string;

  @Column({ comment: '区', length: 50 })
  district: string;

  @Column({ comment: '街道', length: 100 })
  street: string;

  @Column({ comment: '详细地址', length: 255 })
  detailedAddress: string;

  @Column({ comment: '是否修改过地址', type: 'boolean', default: false })
  isAddressModified: boolean;

  @Column({ comment: '买家留言', nullable: true, type: 'text' })
  buyerMessage: string;

  @Column({ comment: '订单提交时间', type: 'timestamp' })
  orderSubmissionTime: Date;

  @Column({ comment: '旗帜颜色', nullable: true, length: 20 })
  flagColor: string;

  @Column({ comment: '商家备注', nullable: true, type: 'text' })
  merchantRemark: string;

  @Column({ comment: '订单完成时间', nullable: true, type: 'timestamp' })
  orderCompletionTime: Date;

  @Column({ comment: '支付完成时间', nullable: true, type: 'timestamp' })
  paymentCompletionTime: Date;

  @Column({ comment: 'APP渠道', length: 50 })
  appChannel: string;

  @Column({ comment: '流量来源', length: 50 })
  trafficSource: string;

  @Column({ comment: '订单状态', length: 50 })
  orderStatus: string;

  @Column({ comment: '承诺发货时间', nullable: true, type: 'timestamp' })
  promisedDeliveryTime: Date;

  @Column({ comment: '订单类型', length: 50 })
  orderType: string;

  @Column({ comment: '鲁班落地页ID', nullable: true, length: 50 })
  lubanPageId: string;

  @Column({ comment: '达人ID', nullable: true, length: 50 })
  influencerId: string;

  @Column({ comment: '达人昵称', nullable: true, length: 50 })
  influencerNickname: string;

  @Column({ comment: '所属门店ID', nullable: true, length: 50 })
  storeId: string;

  @Column({ comment: '售后状态', nullable: true, length: 50 })
  afterSalesStatus: string;

  @Column({ comment: '取消原因', nullable: true, type: 'text' })
  cancellationReason: string;

  @Column({ comment: '预约发货时间', nullable: true, type: 'timestamp' })
  scheduledDeliveryTime: Date;

  @Column({ comment: '仓库ID', nullable: true, length: 50 })
  warehouseId: string;

  @Column({ comment: '仓库名称', nullable: true, length: 100 })
  warehouseName: string;

  @Column({ comment: '是否安心购', type: 'boolean', default: false })
  isSafePurchase: boolean;

  @Column({ comment: '广告渠道', nullable: true, length: 50 })
  adChannel: string;

  @Column({ comment: '流量类型', nullable: true, length: 50 })
  trafficType: string;

  @Column({ comment: '流量体裁', nullable: true, length: 50 })
  trafficFormat: string;

  @Column({ comment: '流量渠道', nullable: true, length: 50 })
  trafficChannel: string;

  @Column({ comment: '发货主体', nullable: true, length: 100 })
  deliveryEntity: string;

  @Column({ comment: '发货主体明细', nullable: true, type: 'text' })
  deliveryEntityDetails: string;

  @Column({ comment: '发货时间', nullable: true, type: 'timestamp' })
  deliveryTime: Date;

  @Column({
    comment: '降价类优惠',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  priceReductionDiscount: number;

  @Column({
    comment: '平台实际承担优惠金额',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  platformActualDiscount: number;

  @Column({
    comment: '商家实际承担优惠金额',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  merchantActualDiscount: number;

  @Column({
    comment: '达人实际承担优惠金额',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  influencerActualDiscount: number;

  @Column({ comment: '预计送达时间', nullable: true, type: 'timestamp' })
  estimatedDeliveryTime: Date;

  @Column({
    comment: '是否平台仓自流转',
    type: 'boolean',
    default: false,
  })
  isPlatformWarehouseAutoTransfer: boolean;

  @Column({ comment: '车型', nullable: true, length: 50 })
  vehicleType: string;

  @Column({ comment: '预约送达时间', nullable: true, type: 'timestamp' })
  scheduledDeliveryArrivalTime: Date;

  @Column({ comment: '建议发货时间（起）', nullable: true, type: 'timestamp' })
  suggestedDeliveryStartTime: Date;

  @Column({ comment: '建议发货时间（止）', nullable: true, type: 'timestamp' })
  suggestedDeliveryEndTime: Date;
}