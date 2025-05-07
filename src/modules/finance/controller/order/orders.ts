import { CoolController, BaseController } from '@cool-midway/core';
import { FinanceOrdersEntity } from '../../entity/orders';
import { FinanceOrdersService } from '../../service/orders';
import { FinanceOrdersQueryDTO } from '../../dto/orders';
import { Inject, Controller, Get, Query, Post, Body, Provide, Files } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Context } from 'vm';
import * as xlsx from 'node-xlsx';
import { existsSync } from 'fs';
import { Validate } from '@midwayjs/validate';
import * as ExcelJS from 'exceljs';

/**
 * 财务模块-订单信息
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: FinanceOrdersEntity,
  service: FinanceOrdersService,
})
export class FinanceOrdersEntityController extends BaseController {
  @InjectEntityModel(FinanceOrdersEntity)
  financeOrdersEntity: Repository<FinanceOrdersEntity>;

  @Inject()
  ctx: Context;  // 注入上下文对象

  @Inject()
  financeOrdersService: FinanceOrdersService;

  @Get('/export')
  @Validate()
  async export(@Query() query: FinanceOrdersQueryDTO) {
    const { headers, data } = await this.financeOrdersService.export(query);

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Finance Orders');

    // Add headers with Chinese labels
    worksheet.columns = headers.map(header => ({
      header: header.label, // Use Chinese label for display
      key: header.key,      // Use key for data mapping
      width: 20,
    }));

    // Add data
    worksheet.addRows(data);

    // Set response headers
    this.ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    this.ctx.set('Content-Disposition', 'attachment; filename=finance-orders.xlsx');

    // Write to buffer and return
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  @Post('/import')
  async importExcel(@Files() files) {
    try {
      // 检查文件对象是否存在
      if (!files || files.length === 0) {
        console.log('No files uploaded');
        return this.fail('未上传文件');
      }

      // 获取第一个文件
      const file = files[0];
      console.log('Uploaded File:', file);

      // 检查文件路径是否存在
      if (!file?.data) {
        console.log('File data is missing');
        return this.fail('上传的文件路径不存在');
      }

      // 打印文件路径信息，检查文件上传路径
      console.log('File Path:', file.data);

      // 检查文件路径是否有效
      if (!existsSync(file.data)) {
        console.log('File does not exist at the path:', file.data);
        return this.fail('上传的文件不存在');
      }

      // 如果路径存在，继续读取文件
      console.log('Reading the Excel file from:', file.data);

      // 读取 Excel 文件
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(file.data);
      const worksheet = workbook.getWorksheet(1);

      if (!worksheet) {
        console.log('No worksheet found in the Excel file');
        return this.fail('Excel 文件没有找到工作表');
      }

      // 打印工作表的基本信息
      console.log('Found worksheet:', worksheet.name);

      // 解析工作表数据
      const data: any[] = [];
      const headers: string[] = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
          // 第一行是表头
          row.eachCell(cell => {
            headers.push(cell.value ? String(cell.value).trim() : '');
          });
          console.log('Headers:', headers);
        } else {
          // 数据行
          const rowData: any = {};
          row.eachCell((cell, colNumber) => {
            const header = headers[colNumber - 1];
            if (header) {
              rowData[header] = cell.value !== null && cell.value !== undefined ? cell.value : '';
            }
          });
          if (Object.keys(rowData).length > 0) {
            data.push(rowData);
          }
        }
      });

      // 检查是否有有效数据
      if (data.length === 0) {
        console.log('No valid data found in the Excel file');
        return this.fail('Excel 文件中没有有效数据');
      }

      // 调用服务方法处理数据
      console.log('Processing data for import...');
      const result = await this.financeOrdersService.import(data);

      console.log('Import successful:', result);

      return this.ok({
        message: '导入成功',
        data: result,
      });
    } catch (error) {
      console.error('导入失败:', error);
      return this.fail('导入失败: ' + error.message);
    }
  }

  @Post('/page2')
  async page2(@Body() query: FinanceOrdersQueryDTO) {
    try {
      // 调用服务层的方法获取分页数据
      const result = await this.financeOrdersService.orderPag(query);
      return this.ok({
        list: result.list,
        pagination: {
          page: query.page,
          size: query.size,
          total: result.total
        },
        message: '成功',
      });
    } catch (error) {
      return this.fail('查询失败: ' + error.message);
    }
  }
}


