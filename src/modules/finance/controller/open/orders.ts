import { FinanceOrdersService } from '../../service/orders';
import { FinanceOrdersEntity } from '../../entity/orders';
import { FinanceOrdersQueryDTO } from '../../dto/orders';
import { Inject, Controller, Get, Query, Post, Body, Provide, Files } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Context } from 'vm';
import * as xlsx from 'node-xlsx';
import { existsSync } from 'fs';
import { Validate } from '@midwayjs/validate';
import * as ExcelJS from 'exceljs';

/**
 * 财务模块-订单控制器
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
  ctx: Context;  // 注入上下文对象

  @Inject()
  financeOrdersService: FinanceOrdersService;

  // @Post('/sqlPage', { summary: 'sql分页查询' })
  // async sqlPage(@Body() query) {
  //   return this.ok(await this.financeOrdersService.sqlPage(query));
  // }

  // @Post('/entityPage', { summary: 'entity分页查询' })
  // async entityPage(@Body() query) {
  //   return this.ok(await this.financeOrdersService.entityPage(query));
  // }

  // @Get("/export", { summary: '导出订单数据' })
  // async exportOrders() {
  //   try {
  //     // 从数据库中获取订单数据
  //     const orders = await this.financeOrdersEntity.find();

  //     if (orders.length === 0) {
  //       return this.fail('没有可导出的订单数据');
  //     }

  //     // 将订单数据转换为二维数组（Excel 表格格式）
  //     const rows = orders.map(order => [
  //       order.main_order_number,
  //       order.sub_order_number,
  //       order.selected_goods,
  //       order.product_specification,
  //       order.product_quantity,
  //       // 可以根据实际需要添加其他字段
  //     ]);

  //     // 在第一行添加表头
  //     const headers = ['主订单号', '子订单号', '选择商品', '商品规格', '商品数量'];
  //     rows.unshift(headers);

  //     // 使用 node-xlsx 将数据转换为 Excel 格式
  //     const buffer = xlsx.build([{ name: "抖音订单数据", data: rows ,options: {}}]);

  //     // 设置导出文件的名称
  //     const fileName = "抖音订单数据.xlsx";

  //     // 将文件发送给客户端
  //     this.ctx.attachment(fileName);
  //     this.ctx.status = 200;
  //     this.ctx.body = buffer;
  //   } catch (err) {
  //     console.error('Export Error:', err);
  //     return this.fail('导出失败: ' + err.message);
  //   }
  // }

  // @Post('/import', { summary: '导入订单数据' })
  // async importExcel(@Files() files) {
  //   try {
  //     // 检查文件对象是否存在
  //     if (!files || files.length === 0) {
  //       return this.fail('未上传文件');
  //     }

  //     // 读取第一个文件
  //     const file = files[0];
  //     console.log('Uploaded File:', file);

  //     // 确保文件路径存在
  //     if (!file.data) {
  //       return this.fail('文件路径不存在');
  //     }

  //     // 使用 node-xlsx 解析文件
  //     const workSheets = xlsx.parse(fs.readFileSync(file.data));
  //     console.log('Parsed Data:', workSheets);

  //     // 示例：处理 Excel 数据
  //     for (const sheet of workSheets) {
  //       const rows = sheet.data;
  //       console.log('Sheet Rows:', rows);

  //       // 跳过表头，保存到数据库
  //       for (let i = 1; i < rows.length; i++) {
  //         const row = rows[i];
  //         await this.financeOrdersEntity.save({
  //           main_order_number: row[0],
  //           sub_order_number: row[1],
  //           selected_goods: row[2],
  //           product_specification: row[3],
  //           product_quantity: row[4],
  //           // 根据具体表头字段映射数据
  //         });
  //       }
  //     }

  //     // 返回成功
  //     return this.ok({ message: '导入成功' });
  //   } catch (err) {
  //     console.error('Import Error:', err);
  //     return this.fail('导入失败: ' + err.message);
  //   } finally {
  //     // 删除临时文件
  //     if (files[0]?.filepath) {
  //       fs.unlinkSync(files[0].filepath);
  //     }
  //   }
  // }

  /**
    * Get paginated list of finance orders
    */
  @Get('/order-list')
  @Validate()
  async orderList(@Query() query: FinanceOrdersQueryDTO) {
    const result = await this.financeOrdersService.list(query);
    return {
      code: 200,
      message: 'Success',
      data: result,
    };
  }

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

  //  @Post('/import')
  //  async import() {
  //    // 获取文件上传
  //    const files = this.ctx.request.files || [];
  //    console.log('Files:', this.ctx.request.files);

  //    if (files.length === 0) {
  //      throw new Error('No file uploaded or invalid file upload');
  //    }

  //    const file = files[0];

  //    // 检查文件路径是否存在
  //    if (!file?.filepath || !existsSync(file.filepath)) {
  //      throw new Error('Uploaded file not found on server');
  //    }

  //    try {
  //      // 读取 Excel 文件
  //      const workbook = new ExcelJS.Workbook();
  //      await workbook.xlsx.readFile(file.filepath);
  //      const worksheet = workbook.getWorksheet(1);

  //      if (!worksheet) {
  //        throw new Error('No worksheet found in the Excel file');
  //      }

  //      // 将工作表数据转化为数组对象
  //      const data: any[] = [];
  //      const headers: string[] = [];

  //      worksheet.eachRow((row, rowNumber) => {
  //        if (rowNumber === 1) {
  //          // 第一行是表头
  //          row.eachCell(cell => {
  //            headers.push(cell.value ? String(cell.value).trim() : '');
  //          });
  //        } else {
  //          // 数据行
  //          const rowData: any = {};
  //          row.eachCell((cell, colNumber) => {
  //            const header = headers[colNumber - 1];
  //            if (header) {
  //              rowData[header] = cell.value !== null && cell.value !== undefined ? cell.value : '';
  //            }
  //          });
  //          if (Object.keys(rowData).length > 0) {
  //            data.push(rowData);
  //          }
  //        }
  //      });

  //      if (data.length === 0) {
  //        throw new Error('No valid data found in the Excel file');
  //      }

  //      // 导入数据
  //      const result = await this.financeOrdersService.import(data);

  //      return {
  //        code: 200,
  //        message: 'Import successful',
  //        data: result,
  //      };
  //    } catch (error) {
  //      throw new Error(`Import failed: ${error.message}`);
  //    }
  //  }


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


}