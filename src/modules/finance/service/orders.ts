import { FinanceOrdersEntity } from '../entity/orders';
import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, FindOptionsWhere, Between, Like } from 'typeorm';

/**
 * 订单示例
 */
@Provide()
export class FinanceOrdersService extends BaseService {
  @InjectEntityModel(FinanceOrdersEntity)
  financeOrdersModel: Repository<FinanceOrdersEntity>;

  /**
   * Conditional query with pagination, supporting fuzzy matching
   * @param query - Query conditions
   */
  async orderPag(query: any) {
    const {
      page = 1,
      size = 10,
      main_order_number,
      sub_order_number,
      order_status,
      startTime,
      endTime,
      keyWord,
      ...otherParams
    } = query;

    const where: FindOptionsWhere<FinanceOrdersEntity> = {};

    // Fuzzy matching for string fields
    if (main_order_number) {
      where.main_order_number = Like(`%${main_order_number}%`);
    }
    if (sub_order_number) {
      where.sub_order_number = Like(`%${sub_order_number}%`);
    }
    if (order_status) {
      where.order_status = Like(`%${order_status}%`);
    }
    if (keyWord) {
      where.sub_order_number = Like(`%${keyWord}%`);
    }
    // Date range condition for order_submission_time
    if (startTime && endTime) {
      where.order_submission_time = Between(new Date(startTime), new Date(endTime));
    }

    // Other dynamic conditions (exact match)
    Object.keys(otherParams).forEach(key => {
      if (otherParams[key] && FinanceOrdersEntity.prototype.hasOwnProperty(key)) {
        where[key] = otherParams[key];
      }
    });

    const [list, total] = await this.financeOrdersModel.findAndCount({
      where,
      skip: (page - 1) * size,
      take: size,
    });
    return { list, total };
  }

  /**
   * Custom SQL query with pagination, supporting fuzzy matching
   * @param query - Query conditions
   */
  async customQuery(query: any) {
    const {
      page = 1,
      size = 10,
      main_order_number,
      sub_order_number,
      order_status,
      startTime,
      endTime,
      keyWord,
      ...otherParams
    } = query;

    // Build query using TypeORM query builder
    const queryBuilder = this.financeOrdersModel.createQueryBuilder('orders');

    
    // Fuzzy matching for string fields
    if (main_order_number) {
      queryBuilder.andWhere('orders.main_order_number LIKE :main_order_number', {
        main_order_number: `%${main_order_number}%`,
      });
    }
    if (sub_order_number) {
      queryBuilder.andWhere('orders.sub_order_number LIKE :sub_order_number', {
        sub_order_number: `%${sub_order_number}%`,
      });
    }
    if (order_status) {
      queryBuilder.andWhere('orders.order_status LIKE :order_status', {
        order_status: `%${order_status}%`,
      });
    }

    if (keyWord) {
      queryBuilder.andWhere('orders.selected_goods LIKE :keyWord', {
        keyWord: `%${keyWord}%`,
      });
    }

    // Date range condition for order_submission_time
    if (startTime && endTime) {
      queryBuilder.andWhere('orders.order_submission_time BETWEEN :startTime AND :endTime', {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      });
    }

    // Other dynamic conditions (exact match)
    Object.keys(otherParams).forEach(key => {
      if (otherParams[key] && FinanceOrdersEntity.prototype.hasOwnProperty(key)) {
        queryBuilder.andWhere(`orders.${key} = :${key}`, { [key]: otherParams[key] });
      }
    });

    // Apply pagination and sorting
    queryBuilder
      .skip((page - 1) * size)
      .take(size);

    // Execute query
    const [list, total] = await queryBuilder.getManyAndCount();

    return { list, total };
  }

  /**
   * Export data with conditions using TypeORM
   * @param query - Query conditions
   */
  async export(query: any) {
    const where: FindOptionsWhere<FinanceOrdersEntity> = {};

    // Apply same conditions as list method
    const {
      main_order_number,
      sub_order_number,
      order_status,
      startTime,
      endTime,
      ...otherParams
    } = query;

    if (main_order_number) {
      where.main_order_number = Like(`%${main_order_number}%`);
    }
    if (sub_order_number) {
      where.sub_order_number = Like(`%${sub_order_number}%`);
    }
    if (order_status) {
      where.order_status = Like(`%${order_status}%`);
    }
    if (startTime && endTime) {
      where.order_submission_time = Between(new Date(startTime), new Date(endTime));
    }

    Object.keys(otherParams).forEach(key => {
      if (otherParams[key] && FinanceOrdersEntity.prototype.hasOwnProperty(key)) {
        where[key] = otherParams[key];
      }
    });

    const data = await this.financeOrdersModel.find({ where });

    // Define export headers with Chinese labels
    const headers = [
      { key: 'main_order_number', label: '主订单编号' },
      { key: 'sub_order_number', label: '子订单编号' },
      { key: 'selected_goods', label: '所选商品' },
      { key: 'product_specification', label: '商品规格' },
      { key: 'product_quantity', label: '商品数量' },
      { key: 'product_id', label: '商品ID' },
      { key: 'merchant_code', label: '商家编码' },
      { key: 'product_price', label: '商品价格' },
      { key: 'order_payable_amount', label: '订单应付金额' },
      { key: 'shipping_fee', label: '运费' },
      { key: 'total_discount_amount', label: '总优惠金额' },
      { key: 'platform_discount', label: '平台优惠' },
      { key: 'merchant_discount', label: '商家优惠' },
      { key: 'influencer_discount', label: '达人优惠' },
      { key: 'merchant_price_adjustment', label: '商家价格调整' },
      { key: 'payment_discount', label: '支付优惠' },
      { key: 'red_envelope_deduction', label: '红包抵扣' },
      { key: 'payment_method', label: '支付方式' },
      { key: 'transaction_fee', label: '交易费用' },
      { key: 'recipient_name', label: '收件人姓名' },
      { key: 'recipient_phone_number', label: '收件人电话' },
      { key: 'province', label: '省份' },
      { key: 'city', label: '城市' },
      { key: 'district', label: '区县' },
      { key: 'street', label: '街道' },
      { key: 'detailed_address', label: '详细地址' },
      { key: 'is_address_modified', label: '地址是否修改' },
      { key: 'buyer_message', label: '买家留言' },
      { key: 'order_submission_time', label: '订单提交时间' },
      { key: 'flag_color', label: '标记颜色' },
      { key: 'merchant_remark', label: '商家备注' },
      { key: 'order_completion_time', label: '订单完成时间' },
      { key: 'payment_completion_time', label: '支付完成时间' },
      { key: 'app_channel', label: '应用渠道' },
      { key: 'traffic_source', label: '流量来源' },
      { key: 'order_status', label: '订单状态' },
      { key: 'promised_delivery_time', label: '承诺配送时间' },
      { key: 'order_type', label: '订单类型' },
      { key: 'luban_page_id', label: '鲁班页面ID' },
      { key: 'influencer_id', label: '达人ID' },
      { key: 'influencer_nickname', label: '达人昵称' },
      { key: 'store_id', label: '店铺ID' },
      { key: 'after_sales_status', label: '售后状态' },
      { key: 'cancellation_reason', label: '取消原因' },
      { key: 'scheduled_delivery_time', label: '计划配送时间' },
      { key: 'warehouse_id', label: '仓库ID' },
      { key: 'warehouse_name', label: '仓库名称' },
      { key: 'is_safe_purchase', label: '是否安心购' },
      { key: 'ad_channel', label: '广告渠道' },
      { key: 'traffic_type', label: '流量类型' },
      { key: 'traffic_format', label: '流量形式' },
      { key: 'traffic_channel', label: '流量渠道' },
      { key: 'delivery_entity', label: '配送主体' },
      { key: 'delivery_entity_details', label: '配送主体详情' },
      { key: 'delivery_time', label: '配送时间' },
      { key: 'price_reduction_discount', label: '降价优惠' },
      { key: 'platform_actual_discount', label: '平台实际优惠' },
      { key: 'merchant_actual_discount', label: '商家实际优惠' },
      { key: 'influencer_actual_discount', label: '达人实际优惠' },
      { key: 'estimated_delivery_time', label: '预计配送时间' },
      { key: 'is_platform_warehouse_auto_transfer', label: '是否平台仓库自动调拨' },
      { key: 'vehicle_type', label: '车辆类型' },
      { key: 'scheduled_delivery_arrival_time', label: '计划配送到达时间' },
      { key: 'suggested_delivery_start_time', label: '建议配送开始时间' },
      { key: 'suggested_delivery_end_time', label: '建议配送结束时间' },
    ];

    // Format data for export
    const exportData = data.map(item => {
      const row: { [key: string]: any } = {};
      headers.forEach(header => {
        row[header.key] = item[header.key] instanceof Date ? item[header.key].toISOString() : item[header.key] ?? '';
      });
      return row;
    });

    return { headers, data: exportData };
  }

  async import(data: any[]) {
    const safeTrim = (value: any) => {
      if (value === '-') {
        return null; // 如果值是 "-", 则将其设置为 null
      }
      if (typeof value === 'string') {
        // 使用正则表达式移除可能导致 SQL 问题的特殊字符
        // 这个正则表达式针对常见的有问题字符，但你可以根据需要进行调整
        return value.trim().replace(/[\0\b\n\r\t\\'"\x1a]/g, '');
      }
      return value;
    };

    const entities = data.map(item => {
      const entity = new FinanceOrdersEntity();

      console.log('---------item:', JSON.stringify(item));

      // Use safeTrim for string fields
      entity.main_order_number = safeTrim(item['主订单编号']) ?? null;
      entity.sub_order_number = safeTrim(item['子订单编号']) ?? null;
      entity.selected_goods = safeTrim(item['选购商品']) ?? null;
      entity.product_specification = safeTrim(item['商品规格']) ?? null;
      entity.product_id = safeTrim(item['商品ID']) ?? null;
      entity.merchant_code = safeTrim(item['商家编码']) ?? null;
      entity.payment_method = safeTrim(item['支付方式']) ?? null;
      entity.recipient_name = safeTrim(item['收件人']) ?? null;
      entity.recipient_phone_number = safeTrim(item['收件人手机号']) ?? null;
      entity.province = safeTrim(item['省']) ?? null;
      entity.city = safeTrim(item['市']) ?? null;
      entity.district = safeTrim(item['区']) ?? null;
      entity.street = safeTrim(item['街道']) ?? null;
      entity.detailed_address = safeTrim(item['详细地址']) ?? null;
      entity.is_address_modified = safeTrim(item['是否修改过地址']) ?? null;
      entity.buyer_message = safeTrim(item['买家留言']) ?? null;
      entity.flag_color = safeTrim(item['旗帜颜色']) ?? null;
      entity.merchant_remark = safeTrim(item['商家备注']) ?? null;
      entity.app_channel = safeTrim(item['APP渠道']) ?? null;
      entity.traffic_source = safeTrim(item['流量来源']) ?? null;
      entity.order_status = safeTrim(item['订单状态']) ?? null;
      entity.order_type = safeTrim(item['订单类型']) ?? null;
      entity.luban_page_id = safeTrim(item['鲁班落地页ID']) ?? null;
      entity.influencer_id = safeTrim(item['达人ID']) ?? null;
      entity.influencer_nickname = safeTrim(item['达人昵称']) ?? null;
      entity.store_id = safeTrim(item['所属门店ID']) ?? null;
      entity.after_sales_status = safeTrim(item['售后状态']) ?? null;
      entity.cancellation_reason = safeTrim(item['取消原因']) ?? null;
      entity.warehouse_id = safeTrim(item['仓库ID']) ?? null;
      entity.warehouse_name = safeTrim(item['仓库名称']) ?? null;
      entity.is_safe_purchase = safeTrim(item['是否安心购']) ?? null;
      entity.ad_channel = safeTrim(item['广告渠道']) ?? null;
      entity.traffic_type = safeTrim(item['流量类型']) ?? null;
      entity.traffic_format = safeTrim(item['流量体裁']) ?? null;
      entity.traffic_channel = safeTrim(item['流量渠道']) ?? null;
      entity.delivery_entity = safeTrim(item['发货主体']) ?? null;
      entity.delivery_entity_details = safeTrim(item['发货主体明细']) ?? null;
      entity.platform_discount = safeTrim(item['平台优惠']) ?? null;
      entity.is_platform_warehouse_auto_transfer = safeTrim(item['是否平台仓自流转']) ?? null;
      entity.vehicle_type = safeTrim(item['车型']) ?? null;

      // Convert dates correctly
      entity.order_submission_time = item['订单提交时间'] ? new Date(item['订单提交时间']) : null;
      entity.order_completion_time = item['订单完成时间'] ? new Date(item['订单完成时间']) : null;
      entity.payment_completion_time = item['支付完成时间'] ? new Date(item['支付完成时间']) : null;
      entity.promised_delivery_time = item['承诺发货时间'] ? new Date(item['承诺发货时间']) : null;
      entity.scheduled_delivery_time = item['预约发货时间'] ? new Date(item['预约发货时间']) : null;
      entity.delivery_time = item['发货时间'] ? new Date(item['发货时间']) : null;
      entity.estimated_delivery_time = item['预计送达时间'] ? new Date(item['预计送达时间']) : null;
      entity.scheduled_delivery_arrival_time = item['预约送达时间'] ? new Date(item['预约送达时间']) : null;
      entity.suggested_delivery_start_time = item['建议发货时间（起）'] ? new Date(item['建议发货时间（起）']) : null;
      entity.suggested_delivery_end_time = item['建议发货时间（止）'] ? new Date(item['建议发货时间（止）']) : null;

      // Handle numeric fields
      entity.product_quantity = parseInt(item['商品数量'], 10) || null;
      entity.product_price = parseFloat(item['商品单价']) || null;
      entity.order_payable_amount = parseFloat(item['订单应付金额']) || null;
      entity.shipping_fee = parseFloat(item['运费']) || 0;
      entity.total_discount_amount = parseFloat(item['优惠总金额']) || 0;
      entity.merchant_discount = parseFloat(item['商家优惠']) || 0;
      entity.influencer_discount = parseFloat(item['达人优惠']) || 0;
      entity.merchant_price_adjustment = parseFloat(item['商家改价']) || 0;
      entity.payment_discount = parseFloat(item['支付优惠']) || 0;
      entity.red_envelope_deduction = parseFloat(item['红包抵扣']) || 0;
      entity.transaction_fee = parseFloat(item['手续费']) || 0;
      entity.price_reduction_discount = parseFloat(item['降价类优惠']) || 0;
      entity.platform_actual_discount = parseFloat(item['平台实际承担优惠金额']) || 0;
      entity.merchant_actual_discount = parseFloat(item['商家实际承担优惠金额']) || 0;
      entity.influencer_actual_discount = parseFloat(item['达人实际承担优惠金额']) || 0;

      return entity;
    });


    // Batch save
    await this.financeOrdersModel.save(entities);
    return { success: true, count: entities.length };
  }

}