import { CoolController, BaseController } from '@cool-midway/core';
import { FinanceTalentCommissionEntity } from '../../entity/talentCommission';

/**
 * 财务模块-订单信息
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: FinanceTalentCommissionEntity,
})
export class FinanceTalentCommissionEntityController extends BaseController {}
