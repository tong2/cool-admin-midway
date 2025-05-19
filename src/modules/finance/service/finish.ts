import { FinanceFinishEntity } from '../entity/finish';
import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';

/**
 * 完成表服务
 */
@Provide()
export class FinanceFinishService extends BaseService {
  @InjectEntityModel(FinanceFinishEntity)
  financeFinishModel: Repository<FinanceFinishEntity>;

  /**
   * Conditional query with pagination, supporting fuzzy matching
   * @param query - Query conditions
   */
  async list(query: any) {
    const {
      page = 1,
      size = 10,
      main_order_number,
      sub_order_number,
      selected_product,
      keyWord,
      ...otherParams
    } = query;

    const where: FindOptionsWhere<FinanceFinishEntity> = {};

    // Fuzzy matching for string fields
    if (main_order_number) {
      where.main_order_number = Like(`%${main_order_number}%`);
    }
    if (sub_order_number) {
      where.sub_order_number = Like(`%${sub_order_number}%`);
    }
    if (selected_product) {
      where.selected_product = Like(`%${selected_product}%`);
    }
    if (keyWord) {
      where.selected_product = Like(`%${keyWord}%`);
    }

    // Other dynamic conditions (exact match)
    Object.keys(otherParams).forEach(key => {
      if (otherParams[key] && FinanceFinishEntity.prototype.hasOwnProperty(key)) {
        where[key] = otherParams[key];
      }
    });

    const [list, total] = await this.financeFinishModel.findAndCount({
      where,
      skip: (page - 1) * size,
      take: size,
    });

    return { list, total };
  }
}