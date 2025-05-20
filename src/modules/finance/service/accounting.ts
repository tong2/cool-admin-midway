import { FinanceAccountingEntity } from '../entity/accounting';
import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';

/**
 * 核算表服务
 */
@Provide()
export class FinanceAccountingService extends BaseService {
  @InjectEntityModel(FinanceAccountingEntity)
  financeAccountingModel: Repository<FinanceAccountingEntity>;

  /**
   * 分页条件查询，支持模糊匹配
   * @param query - 查询条件
   */
  async list(query: any) {
    const {
      page = 1,
      size = 10,
      subOrderNo,
      productId,
      merchantCode,
      keyWord,
      ...otherParams
    } = query;

    const where: FindOptionsWhere<FinanceAccountingEntity> = {};

    // 字符串字段的模糊匹配
    if (subOrderNo) {
      where.subOrderNo = Like(`%${subOrderNo}%`);
    }
    if (productId) {
      where.productId = Like(`%${productId}%`);
    }
    if (merchantCode) {
      where.merchantCode = Like(`%${merchantCode}%`);
    }
    if (keyWord) {
      where.productId = Like(`%${keyWord}%`);
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
}