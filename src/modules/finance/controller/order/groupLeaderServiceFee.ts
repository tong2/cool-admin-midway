import { CoolController, BaseController } from '@cool-midway/core';
import { FinanceGroupLeaderServiceFeeEntity } from '../../entity/groupLeaderServiceFee';

/**
 * 财务模块-订单信息
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: FinanceGroupLeaderServiceFeeEntity,
})
export class FinanceGroupLeaderServiceFeeEntityController extends BaseController {}
