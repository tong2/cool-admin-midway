import { CoolController, BaseController } from '@cool-midway/core';
import { FinanceErpOrdersEntity } from '../../entity/erpOrders';

/**
 * 财务模块-订单信息
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: FinanceErpOrdersEntity,
})
export class FinanceErpOrdersEntityController extends BaseController {
  
}
