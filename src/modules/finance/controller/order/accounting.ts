import { CoolController, BaseController } from '@cool-midway/core';
import { FinanceAccountingEntity } from '../../entity/accounting';
import { FinanceFinishService } from '../../service/finish';
import { FinanceAccountingService } from '../../service/accounting';
import { FinanceAccountingQueryDTO } from '../../dto/accounting'; // Assume a DTO is defined
import { FinanceFinishQueryDTO } from '../../dto/finish';
import { Body, Get, Inject, Post, Provide ,Query} from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Context } from 'vm';
import { Validate } from '@midwayjs/validate';
import * as ExcelJS from 'exceljs';

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

  @Inject()
  financeFinishService: FinanceFinishService;

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

  /**
   * Export data to Excel with two sheets: 完成表 and 核算表
   */
  @Get('/export')
  @Validate()
  async export(@Query() query: FinanceAccountingQueryDTO) {
    // Fetch data for both sheets
    const finishData = await this.financeFinishService.export(query);
    const accountingData = await this.financeAccountingService.export(query);

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();

    // Add 完成表 sheet
    const finishWorksheet = workbook.addWorksheet('完成表');
    finishWorksheet.columns = finishData.headers.map(header => ({
      header: header.label,
      key: header.key,
      width: 20,
    }));
    finishWorksheet.addRows(finishData.data);

    // Add 核算表 sheet
    const accountingWorksheet = workbook.addWorksheet('核算表');
    accountingWorksheet.columns = accountingData.headers.map(header => ({
      header: header.label,
      key: header.key,
      width: 20,
    }));
    accountingWorksheet.addRows(accountingData.data);

    // Set response headers
    this.ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // Encode the filename to handle Chinese characters
    const filename = encodeURIComponent('日报详细表.xlsx');
    this.ctx.set('Content-Disposition', `attachment; filename*=UTF-8''${filename}`);

    // Write to buffer and return
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}