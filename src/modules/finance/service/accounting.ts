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
      where.product_id = Like(`%${keyWord}%`);
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

      // Normalize date to start and end of the day
      const startDate = new Date(genDataTime);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);

      // Check if finance_accounting data exists for the date
      const existingAccountingRecord = await this.financeAccountingModel.findOne({
        where: {
          gen_data_time: startDate,
        },
      });

      if (existingAccountingRecord) {
        console.log(`Data already exists for ${startDate.toISOString().split('T')[0]}`);
        return `该数据日期的核算表已生成过`;
      }

      // Query finance_finish data for the date
      const finishRecords = await this.financeFinishModel.find({
        where: {
          gen_data_time: startDate,
        },
      });

      if (!finishRecords || finishRecords.length === 0) {
        console.log(`No finance_finish data found for ${startDate.toISOString().split('T')[0]}`);
        return `该数据日期的完成表未生成`;
      }

      // Process each finish record to generate accounting records
      const accountingRecords: Partial<FinanceAccountingEntity>[] = finishRecords.map(record => {
        // Use safe and safeNum for data cleaning
        const orderPayableAmount = safeNum(record.order_payable_amount);
        const actualPlatformSubsidy = safeNum(record.platform_actual_discount);
        const influencerDiscountAmount = safeNum(record.talent_actual_discount);
        const platformServiceFee = safeNum(record.platform_service_fee);
        const influencerCommission = safeNum(record.talent_actual_discount); // Placeholder
        const groupLeaderServiceFee = safeNum(record.platform_service_fee); // Placeholder
        const cost = safeNum(record.total_cost);
        const shippingFee = safeNum(record.shipping_fee);
        const operationFee = safeNum(record.operation_fee);

        // Calculate derived fields
        const actualSales = orderPayableAmount + actualPlatformSubsidy + influencerDiscountAmount;
        const platformSubsidyFee = actualPlatformSubsidy * 0.05;
        const platformSubsidyFee2Percent = platformSubsidyFee * 0.02;
        const profit = actualSales - platformSubsidyFee - platformServiceFee - influencerCommission - groupLeaderServiceFee - cost - shippingFee;
        const grossMargin = actualSales !== 0 ? profit / actualSales : 0;

        // Apply negative signs to specified fields if non-zero
        const finalPlatformSubsidyFee = platformSubsidyFee !== 0 ? -platformSubsidyFee : 0;
        const finalPlatformServiceFee = platformServiceFee !== 0 ? -platformServiceFee : 0;
        const finalInfluencerCommission = influencerCommission !== 0 ? -influencerCommission : 0;
        const finalGroupLeaderServiceFee = groupLeaderServiceFee !== 0 ? -groupLeaderServiceFee : 0;
        const finalCost = cost !== 0 ? -cost : 0;
        const finalShippingFee = shippingFee !== 0 ? -shippingFee : 0;
        const finalOperationFee = operationFee !== 0 ? -operationFee : 0;
        const finalProfit = profit !== 0 ? -profit : 0;
        const finalGrossMargin = grossMargin !== 0 ? -grossMargin : 0;

        // Create accounting record
        return {
          sub_order_no: safe(record.sub_order_number),
          product_id: safe(record.product_id),
          merchant_code: safe(record.merchant_code),
          warehouse: safe(record.warehouse_name),
          status: safe(record.status),
          trade_date: record.transaction_time ?? startDate,
          order_quantity: safeNum(record.order_quantity, 1),
          order_payable_amount: orderPayableAmount,
          actual_platform_subsidy: actualPlatformSubsidy,
          influencer_discount_amount: influencerDiscountAmount,
          actual_sales: actualSales,
          platform_subsidy_fee: finalPlatformSubsidyFee,
          platform_service_fee: finalPlatformServiceFee,
          influencer_commission: finalInfluencerCommission,
          group_leader_service_fee: finalGroupLeaderServiceFee,
          cost: finalCost,
          shipping_fee: finalShippingFee,
          operation_fee: finalOperationFee,
          profit: finalProfit,
          gross_margin: finalGrossMargin,
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