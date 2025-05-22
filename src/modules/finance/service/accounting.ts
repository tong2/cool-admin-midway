import { FinanceAccountingEntity } from '../entity/accounting';
import { FinanceFinishEntity } from '../entity/finish';
import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';

const safe = (v: any, fallback: any = '') => v ?? fallback;
const safeNum = (v: any, fallback = 0) => isNaN(Number(v)) ? fallback : Number(v);

/**
 * 核算表服务
 */
@Provide()
export class FinanceAccountingService extends BaseService {
  @InjectEntityModel(FinanceAccountingEntity)
  financeAccountingModel: Repository<FinanceAccountingEntity>;
  @InjectEntityModel(FinanceFinishEntity)
  financeFinishModel: Repository<FinanceFinishEntity>;
  /**
   * 分页条件查询，支持模糊匹配
   * @param query - 查询条件
   */
  async list(query: any) {
    const {
      page = 1,
      size = 10,
      sub_order_no,
      product_id,
      merchantCode,
      keyWord,
      ...otherParams
    } = query;

    const where: FindOptionsWhere<FinanceAccountingEntity> = {};

    // 字符串字段的模糊匹配
    if (sub_order_no) {
      where.sub_order_no = Like(`%${sub_order_no}%`);
    }
    if (product_id) {
      where.product_id = Like(`%${product_id}%`);
    }
    if (keyWord) {
      where.sub_order_no = Like(`%${keyWord}%`);
    }

    // 其他动态条件（精确匹配）
    Object.keys(otherParams).forEach(key => {
      if (otherParams[key] && FinanceAccountingEntity.prototype.hasOwnProperty(key)) {
        where[key] = otherParams[key];
      }
    });

    const [list, total] = await this.financeAccountingModel.findAndCount({
      where,
      skip: (page - 1) * size,
      take: size,
    });

    return { list, total };
  }

  /**
  * 生成核算表
  * @param genDataTime - Data generation timestamp
  * @returns Success or error message
  */
  async generateData(genDataTime: Date): Promise<string> {
    try {
      // Validate input date
      if (!genDataTime || isNaN(genDataTime.getTime())) {
        throw new Error('Invalid date provided');
      }

      // Normalize date to start of the day
      const startDate = new Date(genDataTime);
      startDate.setHours(0, 0, 0, 0);

      // Check if finance_accounting data exists for the date
      const existingAccountingRecord = await this.financeAccountingModel.findOne({
        where: { gen_data_time: startDate },
      });

      if (existingAccountingRecord) {
        console.log(`Data already exists for ${startDate.toISOString().split('T')[0]}`);
        return `该数据日期的核算表已生成过`;
      }

      // Query finance_finish data for the date
      const finishRecords = await this.financeFinishModel.find({
        where: { gen_data_time: startDate },
      });

      if (finishRecords.length === 0) {
        console.log(`No finance_finish data found for ${startDate.toISOString().split('T')[0]}`);
        return `该数据日期的完成表未生成`;
      }

      // Helper to apply negative sign if non-zero
      const negateIfNonZero = (value: number): number => (value !== 0 ? -value : 0);

      // Process each finish record to generate accounting records
      const accountingRecords: Partial<FinanceAccountingEntity>[] = finishRecords.map(record => {
        // Data cleaning with safe and safeNum
        const orderPayableAmount = safeNum(record.order_payable_amount);
        const actualPlatformSubsidy = safeNum(record.platform_actual_discount);
        const influencerDiscountAmount = safeNum(record.talent_actual_discount);
        const platformServiceFee = safeNum(record.platform_service_fee);
        // Placeholder: Set to 0 until correct mappings are provided
        const influencerCommission = 0;
        const groupLeaderServiceFee = 0;
        const cost = safeNum(record.total_cost);
        const shippingFee = safeNum(record.shipping_fee);
        const operationFee = safeNum(record.operation_fee);

        // Calculate derived fields with 2-decimal precision
        const actualSales = Number((safeNum(orderPayableAmount) + safeNum(actualPlatformSubsidy) + safeNum(influencerDiscountAmount)).toFixed(2));
        const platformSubsidyFee = Number((safeNum(actualPlatformSubsidy) * 0.02).toFixed(2));
        const profit = Number((safeNum(actualSales) - safeNum(platformSubsidyFee) - safeNum(platformServiceFee) - safeNum(influencerCommission) - safeNum(groupLeaderServiceFee) - safeNum(cost) - safeNum(shippingFee)).toFixed(2));
        const grossMargin = actualSales !== 0 ? Number((safeNum(profit) / safeNum(actualSales)).toFixed(2)) : 0;

        // Apply negative signs to specified fields
        return {
          sub_order_no: safe(record.sub_order_number),
          product_id: safe(record.product_id),
          merchant_code: safe(record.merchant_code),
          warehouse: safe(record.warehouse_2),
          status: safe(record.status),
          trade_date: record.transaction_time ?? startDate,
          order_quantity: safeNum(record.product_quantity),
          order_payable_amount: orderPayableAmount,
          actual_platform_subsidy: actualPlatformSubsidy,
          influencer_discount_amount: influencerDiscountAmount,
          actual_sales: actualSales,
          platform_subsidy_fee: negateIfNonZero(platformSubsidyFee),
          platform_service_fee: negateIfNonZero(platformServiceFee),
          influencer_commission: negateIfNonZero(influencerCommission),
          group_leader_service_fee: negateIfNonZero(groupLeaderServiceFee),
          cost: negateIfNonZero(cost),
          shipping_fee: negateIfNonZero(shippingFee),
          operation_fee: negateIfNonZero(operationFee),
          profit: profit,
          gross_margin: grossMargin,
          gen_data_time: startDate,
        };
      });

      // Save accounting records
      const savedRecords = await this.financeAccountingModel.save(accountingRecords);
      console.log(`Successfully saved ${savedRecords.length} accounting records for ${startDate.toISOString().split('T')[0]}`);

      return `Data generated successfully for ${startDate.toISOString().split('T')[0]}`;
    } catch (error) {
      console.error('Error generating data:', error);
      throw new Error(`Failed to generate data: ${error.message}`);
    }
  }
}