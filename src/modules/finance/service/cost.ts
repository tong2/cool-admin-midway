import { FinanceCostEntity } from '../entity/cost';
import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';

/**
 * 成本表服务
 */
@Provide()
export class FinanceCostService extends BaseService {
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
      merchant_code,
      product_number,
      product_name,
      keyWord,
      ...otherParams
    } = query;

    const where: FindOptionsWhere<FinanceCostEntity> = {};

    // Fuzzy matching for string fields
    if (merchant_code) {
      where.merchant_code = Like(`%${merchant_code}%`);
    }
    if (product_number) {
      where.product_number = Like(`%${product_number}%`);
    }
    if (product_name) {
      where.product_name = Like(`%${product_name}%`);
    }
    if (keyWord) {
      where.product_name = Like(`%${keyWord}%`);
    }

    // Other dynamic conditions (exact match)
    Object.keys(otherParams).forEach(key => {
      if (otherParams[key] && FinanceCostEntity.prototype.hasOwnProperty(key)) {
        where[key] = otherParams[key];
      }
    });

    const [list, total] = await this.financeCostModel.findAndCount({
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
    const where: FindOptionsWhere<FinanceCostEntity> = {};

    // Apply same conditions as list method
    const {
      merchant_code,
      product_number,
      product_name,
      ...otherParams
    } = query;

    if (merchant_code) {
      where.merchant_code = Like(`%${merchant_code}%`);
    }
    if (product_number) {
      where.product_number = Like(`%${product_number}%`);
    }
    if (product_name) {
      where.product_name = Like(`%${product_name}%`);
    }

    Object.keys(otherParams).forEach(key => {
      if (otherParams[key] && FinanceCostEntity.prototype.hasOwnProperty(key)) {
        where[key] = otherParams[key];
      }
    });

    const data = await this.financeCostModel.find({ where });

    // Define export headers with Chinese labels
    const headers = [
      { key: 'data_time', label: '数据时间' },
      { key: 'merchant_code', label: '商家编码' },
      { key: 'product_number', label: '货品编号' },
      { key: 'product_name', label: '货品名称' },
      { key: 'product_short_name', label: '货品简称' },
      { key: 'category', label: '分类' },
      { key: 'specification_name', label: '规格名称' },
      { key: 'unit_weight', label: '单品重量' },
      { key: 'brand', label: '品牌' },
      { key: 'cost_price', label: '成本价' },
    ];

    // Format data for export
    const exportData = data.map(item => {
      const row: { [key: string]: any } = {};
      headers.forEach(header => {
        row[header.key] = item[header.key] ?? '';
      });
      return row;
    });

    return { headers, data: exportData };
  }

  /**
   * Import cost records from Excel data
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

    const safeDate = (value: any): Date | null => {
      if (!value || value === '-') {
        return null; // Handle falsy values or "-" as null
      }
      try {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return null; // Handle invalid dates
        }
        // Set time to 00:00:00 to keep only year, month, day
        date.setHours(0, 0, 0, 0);
        return date;
      } catch {
        return null; // Handle errors during date parsing
      }
    };

    const entities = data.map(item => {
      const entity = new FinanceCostEntity();

      // String fields
      entity.merchant_code = safeTrim(item['商家编码']) ?? null;
      entity.product_number = safeTrim(item['货品编号']) ?? null;
      entity.product_name = safeTrim(item['货品名称']) ?? null;
      entity.product_short_name = safeTrim(item['货品简称']) ?? null;
      entity.category = safeTrim(item['分类']) ?? null;
      entity.specification_name = safeTrim(item['规格名称']) ?? null;
      entity.brand = safeTrim(item['品牌']) ?? null;

      // Numeric fields
      entity.unit_weight = parseFloat(item['单品重量']) || null;
      entity.cost_price = parseFloat(item['成本价']) || null;

      entity.data_time = safeDate(item['数据时间']);

      return entity;
    });

    // Batch save
    await this.financeCostModel.save(entities);
    return { success: true, count: entities.length };
  }
}