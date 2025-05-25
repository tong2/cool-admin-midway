import { FinanceBoxSpecEntity } from '../entity/box_spec';
import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';

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
const safeNum = (v: any, fallback = 0) => isNaN(Number(v)) ? fallback : Number(v);


/**
 * 箱规表服务
 */
@Provide()
export class FinanceBoxSpecService extends BaseService {
  @InjectEntityModel(FinanceBoxSpecEntity)
  financeBoxSpecModel: Repository<FinanceBoxSpecEntity>;

  /**
   * Conditional query with pagination, supporting fuzzy matching
   * @param query - Query conditions
   */
  async list(query: any) {
    const {
      page = 1,
      size = 10,
      warehouse,
      product_number,
      brand,
      keyWord,
      ...otherParams
    } = query;

    const where: FindOptionsWhere<FinanceBoxSpecEntity> = {};

    // Fuzzy matching for string fields
    if (warehouse) {
      where.warehouse = Like(`%${warehouse}%`);
    }
    if (product_number) {
      where.product_number = Like(`%${product_number}%`);
    }
    if (brand) {
      where.brand = Like(`%${brand}%`);
    }
    if (keyWord) {
      where.product_number = Like(`%${keyWord}%`);
    }

    // Other dynamic conditions (exact match)
    Object.keys(otherParams).forEach(key => {
      if (otherParams[key] && FinanceBoxSpecEntity.prototype.hasOwnProperty(key)) {
        where[key] = otherParams[key];
      }
    });

    const [list, total] = await this.financeBoxSpecModel.findAndCount({
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
    const where: FindOptionsWhere<FinanceBoxSpecEntity> = {};

    // Apply same conditions as list method
    const {
      warehouse,
      product_number,
      brand,
      ...otherParams
    } = query;

    if (warehouse) {
      where.warehouse = Like(`%${warehouse}%`);
    }
    if (product_number) {
      where.product_number = Like(`%${product_number}%`);
    }
    if (brand) {
      where.brand = Like(`%${brand}%`);
    }

    Object.keys(otherParams).forEach(key => {
      if (otherParams[key] && FinanceBoxSpecEntity.prototype.hasOwnProperty(key)) {
        where[key] = otherParams[key];
      }
    });

    const data = await this.financeBoxSpecModel.find({ where });

    // Define export headers with Chinese labels
    const headers = [
      { key: 'gen_data_time', label: '数据时间', isDate: true },
      { key: 'warehouse', label: '仓库' },
      { key: 'brand', label: '品牌' },
      { key: 'product_number', label: '货号' },
      { key: 'box_specification', label: '箱规' },
      { key: 'unit_specification', label: '规格包/提/条/瓶' },
      { key: 'unit_type', label: '包/提/条/瓶' },
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

  /**
   * Import box specification records from Excel data
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
      const entity = new FinanceBoxSpecEntity();

      // String fields
      entity.warehouse = safeTrim(item['仓库']) ?? null;
      entity.brand = safeTrim(item['品牌']) ?? null;
      entity.product_number = safeTrim(item['货号']) ?? null;
      entity.box_specification = safeTrim(item['箱规']) ?? null;
      entity.unit_type = safeTrim(item['包/提/条/瓶']) ?? null;

      entity.unit_specification = safeNum(item['规格包/提/条/瓶']) ?? null;

      entity.gen_data_time = safeDate(item['数据时间']);

      return entity;
    });

    // Check for missing '数据时间' before saving
    const missingDateEntity = entities.find(entity => entity.gen_data_time === null);
    if (missingDateEntity) {
      throw new Error('数据时间必填');
    }

    // Batch save
    await this.financeBoxSpecModel.save(entities);
    return { success: true, count: entities.length };
  }
}