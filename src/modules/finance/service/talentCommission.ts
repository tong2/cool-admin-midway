import { FinanceTalentCommissionEntity } from '../entity/talentCommission';
import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, FindOptionsWhere, Between, Like } from 'typeorm';

/**
 * 达人佣金服务
 */
@Provide()
export class FinanceTalentCommissionService extends BaseService {
  @InjectEntityModel(FinanceTalentCommissionEntity)
  financeTalentCommissionModel: Repository<FinanceTalentCommissionEntity>;

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

    const where: FindOptionsWhere<FinanceTalentCommissionEntity> = {};

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
      if (otherParams[key] && FinanceTalentCommissionEntity.prototype.hasOwnProperty(key)) {
        where[key] = otherParams[key];
      }
    });

    const [list, total] = await this.financeTalentCommissionModel.findAndCount({
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
    const where: FindOptionsWhere<FinanceTalentCommissionEntity> = {};

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
      if (otherParams[key] && FinanceTalentCommissionEntity.prototype.hasOwnProperty(key)) {
        where[key] = otherParams[key];
      }
    });

    const data = await this.financeTalentCommissionModel.find({ where });

    // Define export headers with Chinese labels
    const headers = [
      { key: 'order_id', label: '订单id' },
      { key: 'product_id', label: '商品id' },
      { key: 'product_name', label: '商品名称' },
      { key: 'author_account', label: '作者账号' },
      { key: 'douyin_huoshan_id', label: '抖音/火山号' },
      { key: 'payment_amount', label: '支付金额' },
      { key: 'commission_rate', label: '佣金率' },
      { key: 'estimated_commission', label: '预估佣金支出' },
      { key: 'settled_amount', label: '结算金额' },
      { key: 'actual_commission', label: '实际佣金支出' },
      { key: 'order_status', label: '订单状态' },
      { key: 'unsettled_reason', label: '超时未结算原因' },
      { key: 'payment_time', label: '付款时间' },
      { key: 'receipt_time', label: '收货时间' },
      { key: 'order_settlement_time', label: '订单结算时间' },
      { key: 'product_source', label: '商品来源' },
      { key: 'final_payment_time', label: '尾款支付时间' },
      { key: 'deposit_amount', label: '定金金额' },
      { key: 'shop_id', label: '店铺id' },
      { key: 'shop_name', label: '店铺名称' },
      { key: 'product_quantity', label: '商品数量' },
      { key: 'commission_invoice', label: '佣金发票' },
      { key: 'freeze_ratio', label: '冻结比例' },
      { key: 'is_tiered_commission', label: '是否阶梯佣金' },
      { key: 'threshold_sales', label: '门槛销量' },
      { key: 'base_commission_rate', label: '基础佣金率' },
      { key: 'increased_commission_rate', label: '升佣佣金率' },
      { key: 'estimated_bonus_commission', label: '预估奖励佣金支出' },
      { key: 'settled_bonus_commission', label: '结算奖励佣金支出' },
      { key: 'tiered_plan_id', label: '阶梯计划ID' },
      { key: 'payment_subsidy', label: '支付补贴' },
      { key: 'platform_subsidy', label: '平台补贴' },
      { key: 'talent_subsidy', label: '达人补贴' },
      { key: 'shipping_fee', label: '运费' },
      { key: 'tax_fee', label: '税费' },
      { key: 'shipping_subsidy', label: '运费补贴' },
      { key: 'distribution_source', label: '分销来源' },
      { key: 'marketing_activity_id', label: '营销活动id' },
      { key: 'promotion_rate', label: '推广费率' },
      { key: 'promotion_tech_service_fee', label: '推广技术服务费' },
      { key: 'estimated_promotion_fee', label: '预估推广费支出' },
      { key: 'settled_promotion_fee', label: '结算推广费支出' },
      { key: 'plan_type', label: '计划类型' },
      { key: 'order_source', label: '订单来源' },
      { key: 'traffic_segment_source', label: '流量细分来源' },
      { key: 'traffic_source', label: '流量来源' },
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
   * Import talent commission records from Excel data
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
      const entity = new FinanceTalentCommissionEntity();

      // String fields
      entity.order_id = safeTrim(item['订单id']) ?? null;
      entity.product_id = safeTrim(item['商品id']) ?? null;
      entity.product_name = safeTrim(item['商品名称']) ?? null;
      entity.author_account = safeTrim(item['作者账号']) ?? null;
      entity.douyin_huoshan_id = safeTrim(item['抖音/火山号']) ?? null;
      entity.order_status = safeTrim(item['订单状态']) ?? null;
      entity.unsettled_reason = safeTrim(item['超时未结算原因']) ?? null;
      entity.product_source = safeTrim(item['商品来源']) ?? null;
      entity.shop_id = safeTrim(item['店铺id']) ?? null;
      entity.shop_name = safeTrim(item['店铺名称']) ?? null;
      entity.commission_invoice = safeTrim(item['佣金发票']) ?? null;
      entity.is_tiered_commission = safeTrim(item['是否阶梯佣金']) ?? null;
      entity.tiered_plan_id = safeTrim(item['阶梯计划ID']) ?? null;
      entity.distribution_source = safeTrim(item['分销来源']) ?? null;
      entity.marketing_activity_id = safeTrim(item['营销活动id']) ?? null;
      entity.plan_type = safeTrim(item['计划类型']) ?? null;
      entity.order_source = safeTrim(item['订单来源']) ?? null;
      entity.traffic_segment_source = safeTrim(item['流量细分来源']) ?? null;
      entity.traffic_source = safeTrim(item['流量来源']) ?? null;
      entity.order_type = safeTrim(item['订单类型']) ?? null;

      // Date fields
      entity.effect_time = item['生效时间'] ? new Date(item['生效时间']) : null;
      entity.payment_time = item['付款时间'] ? new Date(item['付款时间']) : null;
      entity.receipt_time = item['收货时间'] ? new Date(item['收货时间']) : null;
      entity.order_settlement_time = item['订单结算时间'] ? new Date(item['订单结算时间']) : null;
      entity.final_payment_time = item['尾款支付时间'] ? new Date(item['尾款支付时间']) : null;

      // Numeric fields
      entity.payment_amount = parseFloat(item['支付金额']) || null;
      entity.commission_rate = parseFloat(item['佣金率']) || null;
      entity.estimated_commission = parseFloat(item['预估佣金支出']) || null;
      entity.settled_amount = parseFloat(item['结算金额']) || null;
      entity.actual_commission = parseFloat(item['实际佣金支出']) || null;
      entity.deposit_amount = parseFloat(item['定金金额']) || null;
      entity.product_quantity = parseInt(item['商品数量'], 10) || null;
      entity.freeze_ratio = parseFloat(item['冻结比例']) || null;
      entity.threshold_sales = parseInt(item['门槛销量'], 10) || null;
      entity.base_commission_rate = parseFloat(item['基础佣金率']) || null;
      entity.increased_commission_rate = parseFloat(item['升佣佣金率']) || null;
      entity.estimated_bonus_commission = parseFloat(item['预估奖励佣金支出']) || null;
      entity.settled_bonus_commission = parseFloat(item['结算奖励佣金支出']) || null;
      entity.payment_subsidy = parseFloat(item['支付补贴']) || null;
      entity.platform_subsidy = parseFloat(item['平台补贴']) || null;
      entity.talent_subsidy = parseFloat(item['达人补贴']) || null;
      entity.shipping_fee = parseFloat(item['运费']) || null;
      entity.tax_fee = parseFloat(item['税费']) || null;
      entity.shipping_subsidy = parseFloat(item['运费补贴']) || null;
      entity.promotion_rate = parseFloat(item['推广费率']) || null;
      entity.promotion_tech_service_fee = parseFloat(item['推广技术服务费']) || null;
      entity.estimated_promotion_fee = parseFloat(item['预估推广费支出']) || null;
      entity.settled_promotion_fee = parseFloat(item['结算推广费支出']) || null;

      return entity;
    });

    // Batch save
    await this.financeTalentCommissionModel.save(entities);
    return { success: true, count: entities.length };
  }
}