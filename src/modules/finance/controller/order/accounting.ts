import { CoolController, BaseController } from '@cool-midway/core';
import { FinanceAccountingEntity } from '../../entity/accounting';
import { FinanceAccountingService } from '../../service/accounting';
import { FinanceAccountingQueryDTO } from '../../dto/accounting'; // Assume a DTO is defined
import { Body, Inject, Post, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Context } from 'vm';
import { Validate } from '@midwayjs/validate';

/**
 * 核算表控制器
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: FinanceAccountingEntity,
  service: FinanceAccountingService,
})
export class FinanceAccountingController extends BaseController {
  @InjectEntityModel(FinanceAccountingEntity)
  financeAccountingModel: Repository<FinanceAccountingEntity>;

  @Inject()
  ctx: Context; // 注入上下文对象

  @Inject()
  financeAccountingService: FinanceAccountingService;

  /**
   * 获取分页核算记录，带替代响应格式
   */
  @Post('/page2')
  @Validate()
  async page2(@Body() query: FinanceAccountingQueryDTO) {
    try {
      const result = await this.financeAccountingService.list(query);
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

  @Post('/generate')
  async generate(@Body() body: { gen_data_time: Date }) {
    if (!body.gen_data_time) {
      return '数据时间为空';
    }
    const genDataTime = new Date(body.gen_data_time);
    const result = await this.financeAccountingService.generateData(genDataTime);
    return this.ok(result);
  }
}