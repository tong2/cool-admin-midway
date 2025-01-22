import { CoolController, BaseController } from '@cool-midway/core';
import { FinanceOrdersEntity } from '../../entity/orders';

/**
 * 财务模块-订单信息
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: FinanceOrdersEntity,
})
export class FinanceOrdersEntityController extends BaseController {}
