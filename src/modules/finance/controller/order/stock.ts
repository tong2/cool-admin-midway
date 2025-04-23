import { CoolController, BaseController } from '@cool-midway/core';
import { FinanceStockEntity } from '../../entity/stock';

/**
 * 财务模块-订单信息
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: FinanceStockEntity,
})
export class FinanceStockEntityController extends BaseController {}
