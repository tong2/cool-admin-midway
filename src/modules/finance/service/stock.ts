import { FinanceStockEntity } from '../entity/stock';
import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';

/**
 * 库存表服务
 */
@Provide()
export class FinanceStockService extends BaseService {
  @InjectEntityModel(FinanceStockEntity)
  financeStockModel: Repository<FinanceStockEntity>;

  /**
   * Conditional query with pagination, supporting fuzzy matching
   * @param query - Query conditions
   */
  async list(query: any) {
    const {
      page = 1,
      size = 10,
      product_code,
      brand_owner,
      supplier,
      keyWord,
      ...otherParams
    } = query;

    const where: FindOptionsWhere<FinanceStockEntity> = {};

    // Fuzzy matching for string fields
    if (product_code) {
      where.product_code = Like(`%${product_code}%`);
    }
    if (keyWord) {
      where.product_code = Like(`%${keyWord}%`);
    }
    if (brand_owner) {
      where.brand_owner = Like(`%${brand_owner}%`);
    }
    if (supplier) {
      where.supplier = Like(`%${supplier}%`);
    }

    // Other dynamic conditions (exact match)
    Object.keys(otherParams).forEach(key => {
      if (otherParams[key] && FinanceStockEntity.prototype.hasOwnProperty(key)) {
        where[key] = otherParams[key];
      }
    });

    const [list, total] = await this.financeStockModel.findAndCount({
      where,
      order: { id: 'DESC' },
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
    const where: FindOptionsWhere<FinanceStockEntity> = {};

    // Apply same conditions as list method
    const {
      product_code,
      brand_owner,
      supplier,
      ...otherParams
    } = query;

    if (product_code) {
      where.product_code = Like(`%${product_code}%`);
    }
    if (brand_owner) {
      where.brand_owner = Like(`%${brand_owner}%`);
    }
    if (supplier) {
      where.supplier = Like(`%${supplier}%`);
    }

    Object.keys(otherParams).forEach(key => {
      if (otherParams[key] && FinanceStockEntity.prototype.hasOwnProperty(key)) {
        where[key] = otherParams[key];
      }
    });

    const data = await this.financeStockModel.find({ where });

    // Define export headers with Chinese labels
    const headers = [
      { key: 'product_code', label: '商品编码' },
      { key: 'weight', label: '重量' },
      { key: 'purchase_price', label: '采购价' },
      { key: 'payment_price', label: '打款价' },
      { key: 'box_specification', label: '箱规' },
      { key: 'product_quantity', label: '商品数量' },
      { key: 'brand_owner', label: '品牌方' },
      { key: 'supplier', label: '供货方' },
      { key: 'is_rebate_calculated', label: '是否计算返利' },
      { key: 'fee1', label: '费用1' },
      { key: 'fee2', label: '费用2' },
      { key: 'fee3', label: '费用3' },
      { key: 'fee4', label: '费用4' },
      { key: 'fee5', label: '费用5' },
      { key: 'rebate', label: '返利' },
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
   * Import stock records from Excel data
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
      const entity = new FinanceStockEntity();

      // String fields
      entity.product_code = safeTrim(item['商品编码']) ?? null;
      entity.box_specification = safeTrim(item['箱规']) ?? null;
      entity.brand_owner = safeTrim(item['品牌方']) ?? null;
      entity.supplier = safeTrim(item['供货方']) ?? null;
      entity.is_rebate_calculated = safeTrim(item['是否计算返利']) ?? null;
      entity.fee1 = safeTrim(item['费用1（比例或者总数）']) ||safeTrim(item['费用1']) || null;
      entity.fee2 = safeTrim(item['费用2']) || null;
      entity.fee3 = safeTrim(item['费用3']) || null;
      entity.fee4 = safeTrim(item['费用4']) || null;
      entity.fee5 = safeTrim(item['费用5']) || null;
      entity.rebate = safeTrim(item['返利']) || null;

      // Numeric fields
      entity.weight = parseFloat(item['重量']) || null;
      entity.purchase_price = parseFloat(item['采购价']) || null;
      entity.payment_price = parseFloat(item['打款价']) || null;
      entity.product_quantity = parseInt(item['商品数量'], 10) || null;
      

      return entity;
    });

    // Batch save
    await this.financeStockModel.save(entities);
    return { success: true, count: entities.length };
  }
}