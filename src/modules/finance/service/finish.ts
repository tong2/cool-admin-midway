import { FinanceFinishEntity } from '../entity/finish';
import { FinanceOrdersEntity } from '../entity/orders';
import { FinanceErpOrdersEntity } from '../entity/erpOrders';
import { FinanceCostEntity } from '../entity/cost';
import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, FindOptionsWhere, Like, Between, In, LessThanOrEqual } from 'typeorm';

const formatDate = (date: Date | null | undefined): string => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * 完成表服务
 */
@Provide()
export class FinanceFinishService extends BaseService {
  @InjectEntityModel(FinanceFinishEntity)
  financeFinishModel: Repository<FinanceFinishEntity>;

  @InjectEntityModel(FinanceOrdersEntity)
  financeOrdersModel: Repository<FinanceOrdersEntity>;

  @InjectEntityModel(FinanceErpOrdersEntity)
  financeErpOrdersModel: Repository<FinanceErpOrdersEntity>;

  @InjectEntityModel(FinanceCostEntity)
  financeCostModel: Repository<FinanceCostEntity>;

  /**
   * Conditional query with pagination, supporting fuzzy matching
   * @param query - Query conditions
   */
  async list(query: any) {
    const {
      page = 1,
      size = 10,
      main_order_number,
      sub_order_number,
      selected_product,
      keyWord,
      ...otherParams
    } = query;

    const where: FindOptionsWhere<FinanceFinishEntity> = {};

    // Fuzzy matching for string fields
    if (main_order_number) {
      where.main_order_number = Like(`%${main_order_number}%`);
    }
    if (sub_order_number) {
      where.sub_order_number = Like(`%${sub_order_number}%`);
    }
    if (selected_product) {
      where.selected_product = Like(`%${selected_product}%`);
    }
    if (keyWord) {
      where.sub_order_number = Like(`%${keyWord}%`);
    }

    // Other dynamic conditions (exact match)
    Object.keys(otherParams).forEach(key => {
      if (otherParams[key] && FinanceFinishEntity.prototype.hasOwnProperty(key)) {
        where[key] = otherParams[key];
      }
    });

    const [list, total] = await this.financeFinishModel.findAndCount({
      where,
      skip: (page - 1) * size,
      take: size,
    });

    return { list, total };
  }

  /**
   * 生成完成表
   * @param genDataTime 
   * @returns 
   */
  async generateData(genDataTime: Date): Promise<string> {
    if (!genDataTime) {
      return '传的数据日期为空';
    }
    const startOfDay = new Date(genDataTime);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const finishCount = await this.financeFinishModel.count({
      where: { gen_data_time: Between(startOfDay, endOfDay) },
    });
    if (finishCount > 0) {
      return '此数据日期已经生成过';
    }

    const ordersCount = await this.financeOrdersModel.count({
      where: { gen_data_time: Between(startOfDay, endOfDay) },
    });
    if (ordersCount === 0) {
      return '订单表在该数据日期没有数据';
    }

    const erpOrdersCount = await this.financeErpOrdersModel.count({
      where: { gen_data_time: Between(startOfDay, endOfDay) },
    });
    if (erpOrdersCount === 0) {
      return 'ERP订单表在该数据日期没有数据';
    }

    const totalCostCount = await this.financeCostModel.count();
    if (totalCostCount === 0) {
      return '成本表没有数据';
    }

    let costDataTime: Date;
    const costCount = await this.financeCostModel.count({
      where: { gen_data_time: Between(startOfDay, endOfDay) },
    });
    if (costCount > 0) {
      costDataTime = startOfDay;
    } else {
      const latestCost = await this.financeCostModel.findOne({
        where: { gen_data_time: LessThanOrEqual(endOfDay) },
        order: { gen_data_time: 'DESC' },
      });
      if (!latestCost) {
        return '成本表没有数据';
      }
      costDataTime = latestCost.gen_data_time;
    }

    const orders = await this.financeOrdersModel.find({
      where: { gen_data_time: Between(startOfDay, endOfDay) },
    });

    const erpOrders = await this.financeErpOrdersModel.find({
      where: {
        gen_data_time: Between(startOfDay, endOfDay),
        original_order_no: In(orders.map(order => order.sub_order_number)),
      },
    });
    const shippingFeeByMainOrder = erpOrders.reduce((acc, erpOrder) => {
      const mainOrder = orders.find(o => o.sub_order_number === erpOrder.original_order_no)?.main_order_number;
      if (mainOrder) {
        console.log('erpOrder.shipping_estimated_cost:' + erpOrder.shipping_estimated_cost);
        acc[mainOrder] = (acc[mainOrder] || 0) + (erpOrder.shipping_estimated_cost || 0);
      }
      return acc;
    }, {} as Record<string, number>);

    const mainOrderGroups = orders.reduce((acc, order) => {
      const mainOrder = order.main_order_number;
      if (!acc[mainOrder]) acc[mainOrder] = [];
      acc[mainOrder].push(order);
      return acc;
    }, {} as Record<string, FinanceOrdersEntity[]>);

    const finishEntities: FinanceFinishEntity[] = [];

    for (const mainOrder in mainOrderGroups) {
      const subOrders = mainOrderGroups[mainOrder];
      const numSubOrders = subOrders.length;
      const totalShippingFee = shippingFeeByMainOrder[mainOrder] || 0;
      const avgShippingFee = Number((totalShippingFee / (numSubOrders || 1)).toFixed(2));

      for (const order of subOrders) {
        const entity = new FinanceFinishEntity();

        // Find the corresponding erpOrder for the current order
        const matchingErpOrder = erpOrders.find(
          erpOrder => erpOrder.original_order_no === order.sub_order_number
        );

        const safe = (v: any, fallback: any = '') => v ?? fallback;
        const safeNum = (v: any, fallback = 0) => isNaN(Number(v)) ? fallback : Number(v);

        Object.assign(entity, {
          main_order_number: safe(order.main_order_number),
          sub_order_number: safe(order.sub_order_number),
          selected_product: safe(order.selected_goods),
          product_specification: safe(order.product_specification),
          product_quantity: safeNum(order.product_quantity),
          product_id: safe(order.product_id),
          merchant_code: safe(order.merchant_code),
          product_unit_price: safeNum(order.product_price),
          order_payable_amount: safeNum(order.order_payable_amount),
          shipping_fee: avgShippingFee,
          total_discount_amount: safeNum(order.total_discount_amount),
          platform_discount: safe(order.platform_discount),
          merchant_discount: safeNum(order.merchant_discount),
          talent_discount: safeNum(order.influencer_discount),
          province: safe(order.province),
          city: safe(order.city),
          district: safe(order.district),
          street: safe(order.street),
          detailed_address: safe(order.detailed_address),
          flag_color: safe(order.flag_color),
          merchant_remark: safe(order.merchant_remark),
          recipient_name: safe(order.recipient_name),
          recipient_phone: safe(order.recipient_phone_number),
          payment_method: safe(order.payment_method),
          transaction_fee: safeNum(order.transaction_fee),
          order_submission_time: order.order_submission_time,
          payment_completion_time: order.payment_completion_time,
          app_channel: safe(order.app_channel),
          traffic_source: safe(order.traffic_source),
          order_status: safe(order.order_status),
          promised_shipping_time: order.promised_delivery_time,
          order_type: safe(order.order_type),
          luban_landing_page_id: safe(order.luban_page_id),
          talent_id: safe(order.influencer_id),
          talent_nickname: safe(order.influencer_nickname),
          store_id: safe(order.store_id),
          after_sales_status: safe(order.after_sales_status),
          cancellation_reason: safe(order.cancellation_reason),
          scheduled_shipping_time: order.scheduled_delivery_time,
          warehouse_id: safe(order.warehouse_id),
          warehouse_name: safe(order.warehouse_name),
          is_secure_purchase: safe(order.is_safe_purchase),
          ad_channel: safe(order.ad_channel),
          traffic_type: safe(order.traffic_type),
          traffic_format: safe(order.traffic_format),
          traffic_channel: safe(order.traffic_channel),
          shipping_entity: safe(order.delivery_entity),
          shipping_entity_details: safe(order.delivery_entity_details),
          shipping_time: order.delivery_time,
          price_reduction_discount: safeNum(order.price_reduction_discount),
          platform_actual_discount: safeNum(order.platform_actual_discount),
          merchant_actual_discount: safeNum(order.merchant_actual_discount),
          talent_actual_discount: safeNum(order.influencer_actual_discount),
          estimated_delivery_time: order.estimated_delivery_time,
          vehicle_type: safe(order.vehicle_type),
          product69_code: safe(order.product69_code),
          shipping_sn_code: safe(order.shipping_sn_code),
          shipping_imei_code_1: safe(order.shipping_imei_code1),
          shipping_imei_code_2: safe(order.shipping_imei_code2),
          scheduled_delivery_time: order.scheduled_delivery_arrival_time,
          suggested_shipping_start: order.suggested_delivery_start_time,
          suggested_shipping_end: order.suggested_delivery_end_time,
          logistics_sn_code: safe(order.logistics_sn_code),
          logistics_imei_code_1: safe(order.logistics_imei_code1),
          logistics_imei_code_2: safe(order.logistics_imei_code2),
          transaction_time: order.payment_completion_time,
          gen_data_time: genDataTime,
          province_2: safe(order.province),
          warehouse_2: safe(matchingErpOrder?.warehouse_name), // Assign warehouse_name from erpOrders
          express_fee: avgShippingFee,
          operation_fee: 0,
          status: safe(order.order_status),
          is_platform_warehouse_transfer: order.is_platform_warehouse_auto_transfer,
        });

        const codeParts = String(order.merchant_code).split('-');
        const lastPart = codeParts[codeParts.length - 1]?.replace('包', '');
        entity.unit_cost = parseInt(lastPart, 10) || 0;
        const truncatedMerchantCode = codeParts.slice(0, -1).join('-');
        entity.order_quantity = entity.product_quantity * entity.unit_cost;

        try {
          const cost = await this.financeCostModel.findOne({
            where: { merchant_code: truncatedMerchantCode, gen_data_time: costDataTime },
          });

          if (cost) {
            entity.total_cost = Number((cost.cost_price * entity.order_quantity).toFixed(2));
            entity.weight = Number((cost.unit_weight * entity.order_quantity).toFixed(2));
          } else {
            console.warn(`未找到成本: ${truncatedMerchantCode} @ ${costDataTime}`);
            entity.total_cost = 0;
            entity.weight = 0;
          }
        } catch (error) {
          console.error(`查找成本异常: ${truncatedMerchantCode}`, error);
          entity.total_cost = 0;
          entity.weight = 0;
        }

        const rate = order.traffic_format === '商品卡' ? 0.006 : 0.025;
        entity.platform_service_fee = Number(
          (
            rate *
            (safeNum(order.order_payable_amount) +
              safeNum(order.platform_actual_discount) +
              safeNum(order.influencer_actual_discount))
          ).toFixed(2)
        );

        entity.erp_cost = entity.total_cost;
        entity.erp_express_fee = avgShippingFee;

        finishEntities.push(entity);
      }
    }

    try {
      await this.financeFinishModel.save(finishEntities, { chunk: 1000 });
      console.log(`成功保存 ${finishEntities.length} 条记录`);
    } catch (error) {
      console.error('保存数据失败:', error);
      return '数据生成失败，请检查服务器日志';
    }

    return '数据生成成功';
  }

  /**
   * Export finish data
   */
  async export(query: any) {
    const where: FindOptionsWhere<FinanceFinishEntity> = {};

    // Apply same conditions as list method
    const { main_order_number, sub_order_number, selected_product, keyWord, ...otherParams } = query;

    if (main_order_number) {
      where.main_order_number = Like(`%${main_order_number}%`);
    }
    if (sub_order_number) {
      where.sub_order_number = Like(`%${sub_order_number}%`);
    }
    if (selected_product) {
      where.selected_product = Like(`%${selected_product}%`);
    }
    if (keyWord) {
      where.sub_order_number = Like(`%${keyWord}%`);
    }

    Object.keys(otherParams).forEach(key => {
      if (otherParams[key] && FinanceFinishEntity.prototype.hasOwnProperty(key)) {
        where[key] = otherParams[key];
      }
    });

    const data = await this.financeFinishModel.find({ where });

    // Define export headers with Chinese labels
    const headers = [
      { key: 'gen_data_time', label: '数据时间', isDate: true },
      { key: 'main_order_number', label: '主订单编号' },
      { key: 'sub_order_number', label: '子订单编号' },
      { key: 'selected_product', label: '选购商品' },
      { key: 'product_specification', label: '商品规格' },
      { key: 'product_quantity', label: '商品数量' },
      { key: 'product_id', label: '商品ID' },
      { key: 'merchant_code', label: '商家编码' },
      { key: 'product_unit_price', label: '商品单价' },
      { key: 'order_payable_amount', label: '订单应付金额' },
      { key: 'shipping_fee', label: '运费' },
      { key: 'total_discount_amount', label: '优惠总金额' },
      { key: 'platform_discount', label: '平台优惠' },
      { key: 'merchant_discount', label: '商家优惠' },
      { key: 'talent_discount', label: '达人优惠' },
      { key: 'merchant_price_adjustment', label: '商家改价' },
      { key: 'payment_discount', label: '支付优惠' },
      { key: 'red_packet_deduction', label: '红包抵扣' },
      { key: 'payment_method', label: '支付方式' },
      { key: 'transaction_fee', label: '手续费' },
      { key: 'recipient_name', label: '收件人' },
      { key: 'recipient_phone', label: '收件人手机号' },
      { key: 'province', label: '省' },
      { key: 'city', label: '市' },
      { key: 'district', label: '区' },
      { key: 'street', label: '街道' },
      { key: 'detailed_address', label: '详细地址' },
      { key: 'order_submission_time', label: '订单提交时间', isDate: true },
      { key: 'merchant_remark', label: '商家备注' },
      { key: 'payment_completion_time', label: '支付完成时间', isDate: true },
      { key: 'app_channel', label: 'APP渠道' },
      { key: 'traffic_source', label: '流量来源' },
      { key: 'order_status', label: '订单状态' },
      { key: 'promised_shipping_time', label: '承诺发货时间', isDate: true },
      { key: 'order_type', label: '订单类型' },
      { key: 'talent_id', label: '达人ID' },
      { key: 'talent_nickname', label: '达人昵称' },
      { key: 'store_id', label: '所属门店ID' },
      { key: 'after_sales_status', label: '售后状态' },
      { key: 'cancellation_reason', label: '取消原因' },
      { key: 'scheduled_shipping_time', label: '预约发货时间', isDate: true },
      { key: 'warehouse_id', label: '仓库ID' },
      { key: 'warehouse_name', label: '仓库名称' },
      { key: 'is_secure_purchase', label: '是否安心购' },
      { key: 'ad_channel', label: '广告渠道' },
      { key: 'traffic_type', label: '流量类型' },
      { key: 'traffic_format', label: '流量体裁' },
      { key: 'traffic_channel', label: '流量渠道' },
      { key: 'shipping_entity', label: '发货主体' },
      { key: 'shipping_entity_details', label: '发货主体明细' },
      { key: 'shipping_time', label: '发货时间', isDate: true },
      { key: 'price_reduction_discount', label: '降价类优惠' },
      { key: 'platform_actual_discount', label: '平台实际承担优惠金额' },
      { key: 'merchant_actual_discount', label: '商家实际承担优惠金额' },
      { key: 'talent_actual_discount', label: '达人实际承担优惠金额' },
      { key: 'estimated_delivery_time', label: '预计送达时间', isDate: true },
      { key: 'is_platform_warehouse_transfer', label: '是否平台仓自流转' },
      { key: 'vehicle_type', label: '车型' },
      { key: 'product69_code', label: '商品69码' },
      { key: 'shipping_sn_code', label: '发货SN码' },
      { key: 'shipping_imei_code_1', label: '发货IMEI码1' },
      { key: 'shipping_imei_code_2', label: '发货IMEI码2' },
      { key: 'scheduled_delivery_time', label: '预约送达时间', isDate: true },
      { key: 'suggested_shipping_start', label: '建议发货时间（起）', isDate: true },
      { key: 'suggested_shipping_end', label: '建议发货时间（止）', isDate: true },
      { key: 'logistics_sn_code', label: '物流SN码' },
      { key: 'logistics_imei_code_1', label: '物流IMEI码1' },
      { key: 'logistics_imei_code_2', label: '物流IMEI码2' },
      { key: 'transaction_time', label: '交易时间', isDate: true },
      { key: 'unit_cost', label: '单位成本' },
      { key: 'order_quantity', label: '订单数量' },
      { key: 'total_cost', label: '成本' },
      { key: 'weight', label: '重量' },
      { key: 'province_2', label: '省份' },
      { key: 'express_fee', label: '快递费' },
      { key: 'operation_fee', label: '操作费' },
      { key: 'platform_service_fee', label: '平台服务费' },
      { key: 'warehouse_2', label: '仓库' },
      { key: 'status', label: '状态' },
      { key: 'erp_cost', label: 'erp成本' },
      { key: 'erp_express_fee', label: 'erp快递费' },
    ];

    // Format data for export
    const exportData = data.map(item => {
      const row: { [key: string]: any } = {};
      headers.forEach(header => {
        if (header.isDate) {
          row[header.key] = formatDate(item[header.key]);
        } else {
          row[header.key] = item[header.key] ?? '';
        }
      });
      return row;
    });

    return { headers, data: exportData };
  }


}