import { FinanceOrdersService } from '../../service/orders';
import { FinanceOrdersEntity } from '../../entity/orders';
import { Body, Config, Inject, Post, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';

/**
 * 测试
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: FinanceOrdersEntity,
  service: FinanceOrdersService,
})
export class OpenFinanceOrdersController extends BaseController {
  @InjectEntityModel(FinanceOrdersEntity)
  financeOrdersEntity: Repository<FinanceOrdersEntity>;

  @Inject()
  financeOrdersService: FinanceOrdersService;

  @Post('/sqlPage', { summary: 'sql分页查询' })
  async sqlPage(@Body() query) {
    return this.ok(await this.financeOrdersService.sqlPage(query));
  }

  @Post('/entityPage', { summary: 'entity分页查询' })
  async entityPage(@Body() query) {
    return this.ok(await this.financeOrdersService.entityPage(query));
  }
}
