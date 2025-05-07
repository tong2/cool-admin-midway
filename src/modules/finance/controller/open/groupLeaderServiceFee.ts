import { FinanceGroupLeaderServiceFeeService } from '../../service/groupLeaderServiceFee';
import { FinanceGroupLeaderServiceFeeEntity } from '../../entity/groupLeaderServiceFee';
import { FinanceGroupLeaderServiceFeeQueryDTO } from '../../dto/groupLeaderServiceFee'; // Assume a DTO is defined
import { Body, Inject, Post, Get, Provide, Files, Query } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Context } from 'vm';
import { Validate } from '@midwayjs/validate';
import * as ExcelJS from 'exceljs';
import { existsSync } from 'fs';

/**
 * 财务模块-团长服务费控制器
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: FinanceGroupLeaderServiceFeeEntity,
  service: FinanceGroupLeaderServiceFeeService,
})
export class OpenFinanceGroupLeaderServiceController extends BaseController {
  // @InjectEntityModel(FinanceGroupLeaderServiceFeeEntity)
  // financeGroupLeaderServiceFeeEntity: Repository<FinanceGroupLeaderServiceFeeEntity>;

  // @Inject()
  // ctx: Context; // 注入上下文对象

  // @Inject()
  // financeGroupLeaderServiceFeeService: FinanceGroupLeaderServiceFeeService;

  // /**
  //  * Get paginated list of group leader service fee records
  //  */
  // @Get('/order-list')
  // @Validate()
  // async orderList(@Query() query: FinanceGroupLeaderServiceFeeQueryDTO) {
  //   const result = await this.financeGroupLeaderServiceFeeService.list(query);
  //   return {
  //     code: 200,
  //     message: 'Success',
  //     data: result,
  //   };
  // }

  // /**
  //  * Export group leader service fee records to Excel
  //  */
  // @Get('/export')
  // @Validate()
  // async export(@Query() query: FinanceGroupLeaderServiceFeeQueryDTO) {
  //   const { headers, data } = await this.financeGroupLeaderServiceFeeService.export(query);

  //   // Create Excel workbook
  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet('Group Leader Service Fees');

  //   // Add headers with Chinese labels
  //   worksheet.columns = headers.map(header => ({
  //     header: header.label, // Use Chinese label for display
  //     key: header.key, // Use key for data mapping
  //     width: 20,
  //   }));

  //   // Add data
  //   worksheet.addRows(data);

  //   // Set response headers
  //   this.ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  //   this.ctx.set('Content-Disposition', 'attachment; filename=group-leader-service-fees.xlsx');

  //   // Write to buffer and return
  //   const buffer = await workbook.xlsx.writeBuffer();
  //   return buffer;
  // }

  // /**
  //  * Import group leader service fee records from Excel
  //  */
  // @Post('/import')
  // async importExcel(@Files() files) {
  //   try {
  //     // Check if file exists
  //     if (!files || files.length === 0) {
  //       console.log('No files uploaded');
  //       return this.fail('未上传文件');
  //     }

  //     // Get the first file
  //     const file = files[0];
  //     console.log('Uploaded File:', file);

  //     // Check if file data exists
  //     if (!file?.data) {
  //       console.log('File data is missing');
  //       return this.fail('上传的文件路径不存在');
  //     }

  //     // Check if file path is valid
  //     console.log('File Path:', file.data);
  //     if (!existsSync(file.data)) {
  //       console.log('File does not exist at the path:', file.data);
  //       return this.fail('上传的文件不存在');
  //     }

  //     // Read Excel file
  //     console.log('Reading the Excel file from:', file.data);
  //     const workbook = new ExcelJS.Workbook();
  //     await workbook.xlsx.readFile(file.data);
  //     const worksheet = workbook.getWorksheet(1);

  //     if (!worksheet) {
  //       console.log('No worksheet found in the Excel file');
  //       return this.fail('Excel 文件没有找到工作表');
  //     }

  //     // Parse worksheet data
  //     console.log('Found worksheet:', worksheet.name);
  //     const data: any[] = [];
  //     const headers: string[] = [];

  //     worksheet.eachRow((row, rowNumber) => {
  //       if (rowNumber === 1) {
  //         // First row is headers
  //         row.eachCell(cell => {
  //           headers.push(cell.value ? String(cell.value).trim() : '');
  //         });
  //         console.log('Headers:', headers);
  //       } else {
  //         // Data rows
  //         const rowData: any = {};
  //         row.eachCell((cell, colNumber) => {
  //           const header = headers[colNumber - 1];
  //           if (header) {
  //             rowData[header] = cell.value !== null && cell.value !== undefined ? cell.value : '';
  //           }
  //         });
  //         if (Object.keys(rowData).length > 0) {
  //           data.push(rowData);
  //         }
  //       }
  //     });

  //     // Check if valid data exists
  //     if (data.length === 0) {
  //       console.log('No valid data found in the Excel file');
  //       return this.fail('Excel 文件中没有有效数据');
  //     }

  //     // Process data for import
  //     console.log('Processing data for import...');
  //     const result = await this.financeGroupLeaderServiceFeeService.import(data);

  //     console.log('Import successful:', result);
  //     return this.ok({
  //       message: '导入成功',
  //       data: result,
  //     });
  //   } catch (error) {
  //     console.error('导入失败:', error);
  //     return this.fail('导入失败: ' + error.message);
  //   }
  // }
}