import { FinanceGroupLeaderServiceFeeEntity } from '../entity/groupLeaderServiceFee';
import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, FindOptionsWhere, Between, Like } from 'typeorm';

/**
 * 团长服务费服务
 */
@Provide()
export class FinanceGroupLeaderServiceFeeService extends BaseService {
  @InjectEntityModel(FinanceGroupLeaderServiceFeeEntity)
  financeGroupLeaderServiceFeeModel: Repository<FinanceGroupLeaderServiceFeeEntity>;

  /**
   * Conditional query with pagination, supporting fuzzy matching
   * @param query - Query conditions
   */
  async list(query: any) {
    const {
      page = 1,
      size = 10,
      order_id,
      order_status,
      shop_name,
      keyWord,
      payment_time_start,
      payment_time_end,
      ...otherParams
    } = query;

    const where: FindOptionsWhere<FinanceGroupLeaderServiceFeeEntity> = {};

    // Fuzzy matching for string fields
    if (order_id) {
      where.order_id = Like(`%${order_id}%`);
    }
    if (keyWord) {
      where.order_id = Like(`%${keyWord}%`);
    }
    if (order_status) {
      where.order_status = Like(`%${order_status}%`);
    }
    if (shop_name) {
      where.shop_name = Like(`%${shop_name}%`);
    }

    // Date range condition for payment_time
    if (payment_time_start && payment_time_end) {
      where.payment_time = Between(new Date(payment_time_start), new Date(payment_time_end));
    }

    // Other dynamic conditions (exact match)
    Object.keys(otherParams).forEach(key => {
      if (otherParams[key] && FinanceGroupLeaderServiceFeeEntity.prototype.hasOwnProperty(key)) {
        where[key] = otherParams[key];
      }
    });

    const [list, total] = await this.financeGroupLeaderServiceFeeModel.findAndCount({
      where,
      skip: (page - 1) * size,
      take: size,
    });

    return { list, total };
  }

  /**
   * Export data with conditions using TypeORM
   * @param query - Query conditions
   */
  async export(query: any) {
    const where: FindOptionsWhere<FinanceGroupLeaderServiceFeeEntity> = {};

    // Apply same conditions as list method
    const {
      order_id,
      order_status,
      shop_name,
      payment_time_start,
      payment_time_end,
      ...otherParams
    } = query;

    if (order_id) {
      where.order_id = Like(`%${order_id}%`);
    }
    if (order_status) {
      where.order_status = Like(`%${order_status}%`);
    }
    if (shop_name) {
      where.shop_name = Like(`%${shop_name}%`);
    }
    if (payment_time_start && payment_time_end) {
      where.payment_time = Between(new Date(payment_time_start), new Date(payment_time_end));
    }

    Object.keys(otherParams).forEach(key => {
      if (otherParams[key] && FinanceGroupLeaderServiceFeeEntity.prototype.hasOwnProperty(key)) {
        where[key] = otherParams[key];
      }
    });

    const data = await this.financeGroupLeaderServiceFeeModel.find({ where });

    // Define export headers with Chinese labels
    const headers = [
      { key: 'order_id', label: '订单id' },
      { key: 'product_name', label: '商品名称' },
      { key: 'product_id', label: '商品id' },
      { key: 'order_status', label: '订单状态' },
      { key: 'unsettled_reason', label: '超时未结算原因' },
      { key: 'issuing_agency', label: '出单机构' },
      { key: 'payment_amount', label: '支付金额' },
      { key: 'service_fee_rate', label: '服务费率' },
      { key: 'estimated_service_fee_income', label: '预估服务费收入' },
      { key: 'settled_amount', label: '结算金额' },
      { key: 'actual_service_fee_income', label: '实际服务费收入' },
      { key: 'payment_time', label: '付款时间' },
      { key: 'receipt_time', label: '收货时间' },
      { key: 'settlement_time', label: '结算时间' },
      { key: 'final_payment_time', label: '尾款支付时间' },
      { key: 'deposit_amount', label: '定金金额' },
      { key: 'shop_id', label: '店铺id' },
      { key: 'shop_name', label: '店铺名称' },
      { key: 'product_quantity', label: '商品数量' },
      { key: 'group_leader_activity_id', label: '团长活动id' },
      { key: 'order_source', label: '订单来源:直播' },
      { key: 'payment_subsidy', label: '支付补贴' },
      { key: 'platform_subsidy', label: '平台补贴' },
      { key: 'talent_subsidy', label: '达人补贴' },
      { key: 'shipping_fee', label: '运费' },
      { key: 'tax_fee', label: '税费' },
      { key: 'shipping_subsidy', label: '运费补贴' },
      { key: 'plan_type', label: '计划类型' },
      { key: 'product_source', label: '商品来源' },
      { key: 'order_source_platform', label: '订单来源:抖音' },
      { key: 'order_type', label: '订单类型' },
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

  /**
   * Import group leader service fee records from Excel data
   * @param data - Parsed Excel data
   */
  async import(data: any[]) {
    const safeTrim = (value: any) => {
      if (value === '-') {
        return null; // Handle "-" as null
      }
      if (typeof value === 'string') {
        // Remove problematic characters
        return value.trim().replace(/[\0\b\n\r\t\\'"\x1a]/g, '');
      }
      return value;
    };

    const entities = data.map(item => {
      const entity = new FinanceGroupLeaderServiceFeeEntity();

      // String fields
      entity.order_id = safeTrim(item['订单id']) ?? null;
      entity.product_name = safeTrim(item['商品名称']) ?? null;
      entity.product_id = safeTrim(item['商品id']) ?? null;
      entity.order_status = safeTrim(item['订单状态']) ?? null;
      entity.unsettled_reason = safeTrim(item['超时未结算原因']) ?? null;
      entity.issuing_agency = safeTrim(item['出单机构']) ?? null;
      entity.shop_id = safeTrim(item['店铺id']) ?? null;
      entity.shop_name = safeTrim(item['店铺名称']) ?? null;
      entity.group_leader_activity_id = safeTrim(item['团长活动id']) ?? null;
      entity.order_source = safeTrim(item['订单来源:直播']) ?? null;
      entity.plan_type = safeTrim(item['计划类型']) ?? null;
      entity.product_source = safeTrim(item['商品来源']) ?? null;
      entity.order_source_platform = safeTrim(item['订单来源:抖音']) ?? null;
      entity.order_type = safeTrim(item['订单类型']) ?? null;

      // Date fields
      entity.payment_time = item['付款时间'] ? new Date(item['付款时间']) : null;
      entity.receipt_time = item['收货时间'] ? new Date(item['收货时间']) : null;
      entity.settlement_time = item['结算时间'] ? new Date(item['结算时间']) : null;
      entity.final_payment_time = item['尾款支付时间'] ? new Date(item['尾款支付时间']) : null;

      // Numeric fields
      entity.payment_amount = parseFloat(item['支付金额']) || null;
      entity.service_fee_rate = parseFloat(item['服务费率']) || null;
      entity.estimated_service_fee_income = parseFloat(item['预估服务费收入']) || null;
      entity.settled_amount = parseFloat(item['结算金额']) || null;
      entity.actual_service_fee_income = parseFloat(item['实际服务费收入']) || null;
      entity.deposit_amount = parseFloat(item['定金金额']) || null;
      entity.product_quantity = parseInt(item['商品数量'], 10) || null;
      entity.payment_subsidy = parseFloat(item['支付补贴']) || null;
      entity.platform_subsidy = parseFloat(item['平台补贴']) || null;
      entity.talent_subsidy = parseFloat(item['达人补贴']) || null;
      entity.shipping_fee = parseFloat(item['运费']) || null;
      entity.tax_fee = parseFloat(item['税费']) || null;
      entity.shipping_subsidy = parseFloat(item['运费补贴']) || null;

      return entity;
    });

    // Batch save
    await this.financeGroupLeaderServiceFeeModel.save(entities);
    return { success: true, count: entities.length };
  }
}