import { FinanceErpOrdersEntity } from '../entity/erpOrders';
import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';

/**
 * 订单示例
 */
@Provide()
export class FinanceErpOrdersService extends BaseService {
  @InjectEntityModel(FinanceErpOrdersEntity)
  FinanceErpOrdersEntity: Repository<FinanceErpOrdersEntity>;

  /**
 * 执行sql分页
 */
  async sqlPage(query) {
    // 示例插入数据，确保与 FinanceErpOrdersEntity 字段匹配
    // await this.FinanceErpOrdersEntity.save({
    //   mainOrderNumber: 'MO123456789',
    //   subOrderNumber: 'SO987654321',
    //   selectedGoods: '示例商品',
    //   productSpecification: '规格A',
    //   productQuantity: 2,
    //   productId: 'PID001',
    //   merchantCode: 'MC001',
    //   productPrice: 99.99,
    //   orderPayableAmount: 199.98,
    //   shippingFee: 10.0,
    //   totalDiscountAmount: 20.0,
    //   platformDiscount: 5.0,
    //   merchantDiscount: 10.0,
    //   influencerDiscount: 5.0,
    //   priceReductionDiscount: 5.0,
    //   platformActualDiscount: 3.0,
    //   merchantActualDiscount: 1.0,
    //   influencerActualDiscount: 1.0,
    //   paymentMethod: '在线支付',
    //   transactionFee: 2.0,
    //   recipientName: '张三',
    //   recipientPhoneNumber: '12345678901',
    //   province: '北京市',
    //   city: '北京市',
    //   district: '海淀区',
    //   street: '中关村',
    //   detailedAddress: '中关村大街27号',
    //   isAddressModified: false,
    //   buyerMessage: '请尽快发货',
    //   orderSubmissionTime: new Date(),
    //   flagColor: '红色',
    //   merchantRemark: '无备注',
    //   orderCompletionTime: new Date(),
    //   paymentCompletionTime: new Date(),
    //   appChannel: 'AppStore',
    //   trafficSource: '抖音广告',
    //   orderStatus: '已完成',
    //   promisedDeliveryTime: new Date(),
    //   orderType: '普通订单',
    //   lubanPageId: 'LB123',
    //   influencerId: 'IN001',
    //   influencerNickname: '达人张三',
    //   storeId: 'STORE001',
    //   afterSalesStatus: '无售后',
    //   cancellationReason: '无',
    //   scheduledDeliveryTime: new Date(),
    //   warehouseId: 'WH001',
    //   warehouseName: '北京仓库',
    //   isSafePurchase: true,
    //   adChannel: '广告渠道A',
    //   trafficType: '流量类型A',
    //   trafficFormat: '图文广告',
    //   trafficChannel: '渠道B',
    //   deliveryEntity: '发货主体A',
    //   deliveryEntityDetails: '发货主体明细A',
    //   deliveryTime: new Date(),
    //   vehicleType: '快递',
    //   scheduledDeliveryArrivalTime: new Date(),
    //   suggestedDeliveryStartTime: new Date(),
    //   suggestedDeliveryEndTime: new Date(),
    // });

    // 分页查询的 SQL 语句更新为查询 finance_orders 表
    return this.sqlRenderPage(
      'select * from finance_orders ORDER BY id ASC',
      query,
      false
    );
  }

  /**
   * 执行entity分页
   */
  async entityPage(query) {
    const find = this.FinanceErpOrdersEntity.createQueryBuilder();
    return this.entityRenderPage(find, query);
  }
}
