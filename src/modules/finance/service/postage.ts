import { FinancePostageEntity } from '../entity/postage';
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

/**
 * 邮资表服务
 */
@Provide()
export class FinancePostageService extends BaseService {
  @InjectEntityModel(FinancePostageEntity)
  financePostageModel: Repository<FinancePostageEntity>;

  /**
   * Conditional query with pagination, supporting fuzzy matching
   * @param query - Query conditions
   */
  async list(query: any) {
    const {
      page = 1,
      size = 10,
      province,
      keyWord,
      ...otherParams
    } = query;

    const where: FindOptionsWhere<FinancePostageEntity> = {};

    // Fuzzy matching for string fields
    if (province) {
      where.province = Like(`%${province}%`);
    }
    if (keyWord) {
      where.province = Like(`%${keyWord}%`);
    }

    // Other dynamic conditions (exact match)
    Object.keys(otherParams).forEach(key => {
      if (otherParams[key] && FinancePostageEntity.prototype.hasOwnProperty(key)) {
        where[key] = otherParams[key];
      }
    });

    const [list, total] = await this.financePostageModel.findAndCount({
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
    const where: FindOptionsWhere<FinancePostageEntity> = {};

    // Apply same conditions as list method
    const {
      province,
      ...otherParams
    } = query;

    if (province) {
      where.province = Like(`%${province}%`);
    }

    Object.keys(otherParams).forEach(key => {
      if (otherParams[key] && FinancePostageEntity.prototype.hasOwnProperty(key)) {
        where[key] = otherParams[key];
      }
    });

    const data = await this.financePostageModel.find({ where });

    // Define export headers with Chinese labels
    const headers = [
      { key: 'gen_data_time', label: '数据时间', isDate: true },
      { key: 'province', label: '省份' },
      { key: 'weight_0_0_5kg_with_pack', label: '0-0.5KG (含打包辅材)' },
      { key: 'weight_0_51_1kg_machine_with_pack', label: '0.51-1KG (机打含打包辅材)' },
      { key: 'weight_1_01_2kg_label', label: '1.01-2KG (贴单件)' },
      { key: 'weight_1_01_2kg_pack', label: '1.01-2KG (打包品)' },
      { key: 'weight_2_01_3kg_label', label: '2.01-3KG (贴单件)' },
      { key: 'weight_2_01_3kg_pack', label: '2.01-3KG (打包品)' },
      { key: 'ten_kg_with_fee_first_3kg', label: '10公斤内首重3公斤 (含辅材和操作费)' },
      { key: 'ten_kg_no_fee_additional_per_kg', label: '10公斤内续重每公斤 (3kg以上不含辅材和操作费)' },
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
   * Import postal rate records from Excel data
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
      const entity = new FinancePostageEntity();

      // String field
      entity.province = safeTrim(item['省份']) ?? null;

      // Numeric fields
      entity.weight_0_0_5kg_with_pack = parseFloat(item['0-0.5KG (含打包辅材)']) || null;
      entity.weight_0_51_1kg_machine_with_pack = parseFloat(item['0.51-1KG (机打含打包辅材)']) || null;
      entity.weight_1_01_2kg_label = parseFloat(item['1.01-2KG (贴单件)']) || null;
      entity.weight_1_01_2kg_pack = parseFloat(item['1.01-2KG (打包品)']) || null;
      entity.weight_2_01_3kg_label = parseFloat(item['2.01-3KG (贴单件)']) || null;
      entity.weight_2_01_3kg_pack = parseFloat(item['2.01-3KG (打包品)']) || null;
      entity.ten_kg_with_fee_first_3kg = parseFloat(item['10公斤内首重3公斤 (含辅材和操作费)']) || null;
      entity.ten_kg_no_fee_additional_per_kg = parseFloat(item['10公斤内续重每公斤 (3kg以上不含辅材和操作费)']) || null;

      entity.gen_data_time = safeDate(item['数据时间']);

      return entity;
    });

    // Check for missing '数据时间' before saving
    const missingDateEntity = entities.find(entity => entity.gen_data_time === null);
    if (missingDateEntity) {
      throw new Error('数据时间必填');
    }

    // Batch save
    await this.financePostageModel.save(entities);
    return { success: true, count: entities.length };
  }
}