import { FinanceFinishEntity } from '../entity/finish';
import { FinanceOrdersEntity } from '../entity/orders';
import { FinanceErpOrdersEntity } from '../entity/erpOrders';
import { FinanceCostEntity } from '../entity/cost';
import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, FindOptionsWhere, Like ,Between} from 'typeorm';

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
     * Generate data for finance_finish table based on gen_data_time
     * @param genDataTime - The date for which to generate data
     * @returns A message indicating the result
     */
  async generateData(genDataTime: Date): Promise<string> {
    // Normalize the date to start and end of day for range queries
    const startOfDay = new Date(genDataTime);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    // Step 1: Check if finance_finish has data for this date
    const finishCount = await this.financeFinishModel.count({
      where: {
        gen_data_time: Between(startOfDay, endOfDay),
      },
    });
    if (finishCount > 0) {
      return '此数据日期已经生成过';
    }

    // Step 2: Check if finance_orders has data for this date
    const ordersCount = await this.financeOrdersModel.count({
      where: {
        gen_data_time: Between(startOfDay, endOfDay),
      },
    });
    if (ordersCount === 0) {
      return '订单表在该数据日期没有数据';
    }

    // Step 3: Check if finance_erp_orders has data for this date
    const erpOrdersCount = await this.financeErpOrdersModel.count({
      where: {
        gen_data_time: Between(startOfDay, endOfDay),
      },
    });
    if (erpOrdersCount === 0) {
      return 'ERP订单表在该数据日期没有数据';
    }

    // Step 4: Check if finance_cost has data for this date
    const costCount = await this.financeCostModel.count({
      where: {
        gen_data_time: Between(startOfDay, endOfDay),
      },
    });
    if (costCount === 0) {
      return '成本表在该数据日期没有数据';
    }

    // Step 5 & 6: Generate data for finance_finish
    // Fetch all orders for the given date
    const orders = await this.financeOrdersModel.find({
      where: {
        gen_data_time: Between(startOfDay, endOfDay),
      },
    });

    // Group orders by main_order_number to calculate average shipping fee
    const mainOrderGroups = orders.reduce((acc, order) => {
      const mainOrder = order.main_order_number;
      if (!acc[mainOrder]) {
        acc[mainOrder] = [];
      }
      acc[mainOrder].push(order);
      return acc;
    }, {} as Record<string, FinanceOrdersEntity[]>);

    const finishEntities: FinanceFinishEntity[] = [];

    for (const mainOrder in mainOrderGroups) {
      const subOrders = mainOrderGroups[mainOrder];
      const numSubOrders = subOrders.length;
      // Assume shipping_fee is the total for the main order, same for all sub-orders
      const totalShippingFee = subOrders[0].shipping_fee || 0;
      const avgShippingFee = numSubOrders > 0 ? Number((totalShippingFee / numSubOrders).toFixed(2)) : 0;

      for (const order of subOrders) {
        const entity = new FinanceFinishEntity();

        // Direct field mappings from finance_orders
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

        // Step 7: Calculate fields
        // Unit cost: Extract number before '包' from merchant_code
        const codeParts = order.merchant_code.split('-');
        const lastPart = codeParts[codeParts.length - 1].replace('包', '');
        entity.unit_cost = parseInt(lastPart, 10) || 0;

        // Order quantity: product_quantity * unit_cost
        entity.order_quantity = order.product_quantity * entity.unit_cost;

        // Fetch cost data
        const cost = await this.financeCostModel.findOne({
          where: {
            product_number: order.product_id,
            gen_data_time: Between(startOfDay, endOfDay),
          },
        });

        if (cost) {
          // Total cost: cost_price * order_quantity
          entity.total_cost = cost.cost_price * entity.order_quantity;
          // Weight: unit_weight * order_quantity
          entity.weight = cost.unit_weight * entity.order_quantity;
        } else {
          entity.total_cost = 0;
          entity.weight = 0;
        }

        // Platform service fee
        const rate = order.traffic_format === '商品卡' ? 0.006 : 0.025;
        entity.platform_service_fee =
          rate *
          (order.order_payable_amount +
            (order.platform_actual_discount || 0) +
            (order.influencer_actual_discount || 0));

        // Set additional fields
        entity.gen_data_time = genDataTime;
        entity.province_2 = order.province; // Assuming province_2 maps to province
        entity.warehouse_2 = order.warehouse_name; // Assuming warehouse_2 maps to warehouse_name

        finishEntities.push(entity);
      }
    }

    // Save all generated entities
    await this.financeFinishModel.save(finishEntities);

    return '数据生成成功';
  }

}