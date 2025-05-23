import { FinanceAccountingEntity } from '../entity/accounting';
import { FinanceFinishEntity } from '../entity/finish';
import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';

const safe = (v: any, fallback: any = '') => v ?? fallback;
const safeNum = (v: any, fallback = 0) => isNaN(Number(v)) ? fallback : Number(v);
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

  /**
  * Export accounting data
  */
  async export(query: any) {
    const where: FindOptionsWhere<FinanceAccountingEntity> = {};

    // Apply same conditions as list method
    const { sub_order_no, product_id, keyWord, ...otherParams } = query;

    if (sub_order_no) {
      where.sub_order_no = Like(`%${sub_order_no}%`);
    }
    if (product_id) {
      where.product_id = Like(`%${product_id}%`);
    }
    if (keyWord) {
      where.sub_order_no = Like(`%${keyWord}%`);
    }

    Object.keys(otherParams).forEach(key => {
      if (otherParams[key] && FinanceAccountingEntity.prototype.hasOwnProperty(key)) {
        where[key] = otherParams[key];
      }
    });

    const data = await this.financeAccountingModel.find({ where });

    // Define export headers with Chinese labels
    const headers = [
      { key: 'gen_data_time', label: '数据时间', isDate: true },
      { key: 'sub_order_no', label: '子订单编号' },
      { key: 'status', label: '状态' },
      { key: 'warehouse', label: '仓库' },
      { key: 'trade_date', label: '交易日期', isDate: true },
      { key: 'product_id', label: '商品ID' },
      { key: 'merchant_code', label: '商家编码' },
      { key: 'order_quantity', label: '订单数量' },
      { key: 'order_payable_amount', label: '订单应付金额' },
      { key: 'actual_platform_subsidy', label: '实际平台补贴' },
      { key: 'influencer_discount_amount', label: '达人实际承担优惠金额' },
      { key: 'actual_sales', label: '实销' },
      { key: 'platform_subsidy_fee', label: '平台补贴扣费（2%）' },
      { key: 'platform_service_fee', label: '平台服务费' },
      { key: 'influencer_commission', label: '达人佣金' },
      { key: 'group_leader_service_fee', label: '团长服务费' },
      { key: 'cost', label: '成本' },
      { key: 'shipping_fee', label: '快递费' },
      { key: 'operation_fee', label: '操作费' },
      { key: 'profit', label: '利润' },
      { key: 'gross_margin', label: '毛利率' },
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