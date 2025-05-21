import { FinanceFinishEntity } from '../entity/finish';
import { FinanceOrdersEntity } from '../entity/orders';
import { FinanceErpOrdersEntity } from '../entity/erpOrders';
import { FinanceCostEntity } from '../entity/cost';
import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, FindOptionsWhere, Like, Between, In, LessThanOrEqual } from 'typeorm';

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
      where.selected_product = Like(`%${keyWord}%`);
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
    // 规范化日期为当天的开始和结束时间
    const startOfDay = new Date(genDataTime);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    // Step 1: 检查 finance_finish 表是否已有该日期的数据
    const finishCount = await this.financeFinishModel.count({
      where: { gen_data_time: Between(startOfDay, endOfDay) },
    });
    if (finishCount > 0) {
      return '此数据日期已经生成过';
    }

    // Step 2: 检查 finance_orders 表是否已有该日期的数据
    const ordersCount = await this.financeOrdersModel.count({
      where: { gen_data_time: Between(startOfDay, endOfDay) },
    });
    if (ordersCount === 0) {
      return '订单表在该数据日期没有数据';
    }

    // Step 3: 检查 finance_erp_orders 表是否已有该日期的数据
    const erpOrdersCount = await this.financeErpOrdersModel.count({
      where: { gen_data_time: Between(startOfDay, endOfDay) },
    });
    if (erpOrdersCount === 0) {
      return 'ERP订单表在该数据日期没有数据';
    }

    // Step 4: 检查 finance_cost 表是否存在任何数据
    const totalCostCount = await this.financeCostModel.count();
    if (totalCostCount === 0) {
      return '成本表没有数据';
    }

    // 确定成本数据的 gen_data_time
    let costDataTime: Date;
    // 优先检查指定日期的成本数据
    const costCount = await this.financeCostModel.count({
      where: { gen_data_time: Between(startOfDay, endOfDay) },
    });
    if (costCount > 0) {
      costDataTime = startOfDay; // 使用指定日期
    } else {
      // 如果指定日期无数据，查找最新的 gen_data_time
      const latestCost = await this.financeCostModel.findOne({
        where: { gen_data_time: LessThanOrEqual(endOfDay) },
        order: { gen_data_time: 'DESC' },
      });
      if (!latestCost) {
        return '成本表没有数据';
      }
      costDataTime = latestCost.gen_data_time;
    }

    // 获取订单数据
    const orders = await this.financeOrdersModel.find({
      where: { gen_data_time: Between(startOfDay, endOfDay) },
    });

    // 获取 ERP 订单数据
    const erpOrders = await this.financeErpOrdersModel.find({
      where: {
        gen_data_time: Between(startOfDay, endOfDay),
        order_number: In(orders.map(order => order.sub_order_number)),
      },
    });

    // 计算每个主订单的邮资费用
    const shippingFeeByMainOrder = erpOrders.reduce((acc, erpOrder) => {
      const mainOrder = orders.find(o => o.sub_order_number === erpOrder.original_order_no)?.main_order_number;
      if (mainOrder) {
        acc[mainOrder] = (acc[mainOrder] || 0) + (erpOrder.shipping_fee || 0);
      } else {
        console.warn(`未找到匹配的主订单: ERP order_number=${erpOrder.original_order_no}`);
      }
      return acc;
    }, {} as Record<string, number>);

    // 按主订单分组
    const mainOrderGroups = orders.reduce((acc, order) => {
      const mainOrder = order.main_order_number;
      if (!acc[mainOrder]) {
        acc[mainOrder] = [];
      }
      acc[mainOrder].push(order);
      return acc;
    }, {} as Record<string, FinanceOrdersEntity[]>);

    const finishEntities: FinanceFinishEntity[] = [];

    // 遍历主订单和子订单，生成完成表数据
    for (const mainOrder in mainOrderGroups) {
      const subOrders = mainOrderGroups[mainOrder];
      const numSubOrders = subOrders.length;
      const totalShippingFee = shippingFeeByMainOrder[mainOrder] || 0;
      const avgShippingFee = numSubOrders > 0 ? Number((totalShippingFee / numSubOrders).toFixed(2)) : 0;

      for (const order of subOrders) {
        const entity = new FinanceFinishEntity();

        // 直接映射字段
        entity.main_order_number = order.main_order_number;
        entity.sub_order_number = order.sub_order_number;
        entity.selected_product = order.selected_goods;
        entity.product_specification = order.product_specification;
        entity.product_quantity = order.product_quantity;
        entity.product_id = order.product_id;
        entity.merchant_code = order.merchant_code;
        entity.product_unit_price = order.product_price;
        entity.order_payable_amount = order.order_payable_amount;
        entity.shipping_fee = avgShippingFee;
        entity.total_discount_amount = order.total_discount_amount;
        entity.platform_discount = order.platform_discount;
        entity.merchant_discount = order.merchant_discount;
        entity.talent_discount = order.influencer_discount;
        entity.province = order.province;
        entity.city = order.city;
        entity.district = order.district;
        entity.street = order.street;
        entity.detailed_address = order.detailed_address;
        entity.recipient_name = order.recipient_name;
        entity.recipient_phone = order.recipient_phone_number;
        entity.payment_method = order.payment_method;
        entity.transaction_fee = order.transaction_fee;
        entity.order_submission_time = order.order_submission_time;
        entity.payment_completion_time = order.payment_completion_time;
        entity.app_channel = order.app_channel;
        entity.traffic_source = order.traffic_source;
        entity.order_status = order.order_status;
        entity.promised_shipping_time = order.promised_delivery_time;
        entity.order_type = order.order_type;
        entity.luban_landing_page_id = order.luban_page_id;
        entity.talent_id = order.influencer_id;
        entity.talent_nickname = order.influencer_nickname;
        entity.store_id = order.store_id;
        entity.after_sales_status = order.after_sales_status;
        entity.cancellation_reason = order.cancellation_reason;
        entity.scheduled_shipping_time = order.scheduled_delivery_time;
        entity.warehouse_id = order.warehouse_id;
        entity.warehouse_name = order.warehouse_name;
        entity.is_secure_purchase = order.is_safe_purchase;
        entity.ad_channel = order.ad_channel;
        entity.traffic_type = order.traffic_type;
        entity.traffic_format = order.traffic_format;
        entity.traffic_channel = order.traffic_channel;
        entity.shipping_entity = order.delivery_entity;
        entity.shipping_entity_details = order.delivery_entity_details;
        entity.shipping_time = order.delivery_time;
        entity.price_reduction_discount = order.price_reduction_discount;
        entity.platform_actual_discount = order.platform_actual_discount;
        entity.merchant_actual_discount = order.merchant_actual_discount;
        entity.talent_actual_discount = order.influencer_actual_discount;
        entity.estimated_delivery_time = order.estimated_delivery_time;
        entity.vehicle_type = order.vehicle_type;
        entity.product69_code = order.product69_code;
        entity.shipping_sn_code = order.shipping_sn_code;
        entity.shipping_imei_code_1 = order.shipping_imei_code1;
        entity.shipping_imei_code_2 = order.shipping_imei_code2;
        entity.scheduled_delivery_time = order.scheduled_delivery_arrival_time;
        entity.suggested_shipping_start = order.suggested_delivery_start_time;
        entity.suggested_shipping_end = order.suggested_delivery_end_time;
        entity.logistics_sn_code = order.logistics_sn_code;
        entity.logistics_imei_code_1 = order.logistics_imei_code1;
        entity.logistics_imei_code_2 = order.logistics_imei_code2;

        // 计算字段
        // 单位成本：从 merchant_code 提取最后一个“-”分隔部分的数字
        const codeParts = order.merchant_code.split('-');
        const lastPart = codeParts[codeParts.length - 1].replace('包', '');
        entity.unit_cost = parseInt(lastPart, 10) || 0;

        // 截取商品编码：最后一个“-”之前的内容
        const truncatedMerchantCode = codeParts.slice(0, -1).join('-');

        // 订单数量：product_quantity * unit_cost
        entity.order_quantity = order.product_quantity * entity.unit_cost;

        // 查询成本数据，使用截取的商品编码和确定的 costDataTime
        try {
          const cost = await this.financeCostModel.findOne({
            where: {
              merchant_code: truncatedMerchantCode,
              gen_data_time: costDataTime,
            },
          });

          if (cost) {
            // 总成本：cost_price * order_quantity
            entity.total_cost = Number((cost.cost_price * entity.order_quantity).toFixed(2));
            // 重量：unit_weight * order_quantity
            entity.weight = Number((cost.unit_weight * entity.order_quantity).toFixed(2));
          } else {
            console.warn(`成本数据未找到: merchant_code=${truncatedMerchantCode}, gen_data_time=${costDataTime}`);
            entity.total_cost = 0;
            entity.weight = 0;
          }
        } catch (error) {
          console.error(`查询成本数据失败: merchant_code=${truncatedMerchantCode}, 错误: ${error.message}`);
          entity.total_cost = 0;
          entity.weight = 0;
        }

        // 平台服务费
        const rate = order.traffic_format === '商品卡' ? 0.006 : 0.025;
        entity.platform_service_fee = Number(
          (
            rate *
            ((order.order_payable_amount || 0)+
              (order.platform_actual_discount || 0) +
              (order.influencer_actual_discount || 0))
          ).toFixed(2)
        );

        // 额外字段
        entity.gen_data_time = genDataTime;
        entity.province_2 = order.province;
        entity.warehouse_2 = order.warehouse_name;
        entity.express_fee = entity.shipping_fee;
        entity.operation_fee = 0; // 占位，需确认业务逻辑
        entity.status = order.order_status;
        entity.erp_cost = entity.total_cost;
        entity.erp_express_fee = entity.shipping_fee;
        entity.transaction_time = order.payment_completion_time;
        entity.is_platform_warehouse_transfer = order.is_platform_warehouse_auto_transfer;

        finishEntities.push(entity);
      }
    }

    // 保存数据
    try {
      await this.financeFinishModel.save(finishEntities, { chunk: 1000 });
    } catch (error) {
      console.error(`保存数据失败: ${error.message}`);
      return '数据生成失败，请检查服务器日志';
    }

    return '数据生成成功';
  }

}