import { CoolController, BaseController } from '@cool-midway/core';
import { FinanceFinishEntity } from '../../entity/finish';
import { FinanceFinishService } from '../../service/finish';
import { FinanceFinishQueryDTO } from '../../dto/finish'; // Assume a DTO is defined
import { Body, Inject, Post, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Context } from 'vm';
import { Validate } from '@midwayjs/validate';

/**
 * 完成表控制器
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: FinanceFinishEntity,
  service: FinanceFinishService,
})
export class FinanceFinishController extends BaseController {
  @InjectEntityModel(FinanceFinishEntity)
  financeFinishModel: Repository<FinanceFinishEntity>;

  @Inject()
  ctx: Context; // 注入上下文对象

  @Inject()
  financeFinishService: FinanceFinishService;

  /**
   * Get paginated completion records with alternative response format
   */
  @Post('/page2')
  @Validate()
  async page2(@Body() query: FinanceFinishQueryDTO) {
    try {
      const result = await this.financeFinishService.list(query);
      return this.ok({
        list: result.list,
        pagination: {
          page: query.page,
          size: query.size,
          total: result.total,
        },
        message: '成功',
      });
    } catch (error) {
      return this.fail('查询失败: ' + error.message);
    }
  }
}