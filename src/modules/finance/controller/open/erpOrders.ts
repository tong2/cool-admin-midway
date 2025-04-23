import { FinanceErpOrdersService } from '../../service/erpOrders';
import { FinanceErpOrdersEntity } from '../../entity/erpOrders';
import { Body, Inject, Post,Get, Provide, Files  } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Context } from 'vm';
import * as xlsx from 'node-xlsx';
import * as fs from 'fs';

/**
 * 财务模块-订单控制器
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: FinanceErpOrdersEntity,
  service: FinanceErpOrdersService,
})
export class OpenFinanceErpOrdersController extends BaseController {
  @InjectEntityModel(FinanceErpOrdersEntity)
  FinanceErpOrdersEntity: Repository<FinanceErpOrdersEntity>;

  @Inject()
  ctx: Context;  // 注入上下文对象

  @Inject()
  FinanceErpOrdersService: FinanceErpOrdersService;

  @Post('/sqlPage', { summary: 'sql分页查询' })
  async sqlPage(@Body() query) {
    return this.ok(await this.FinanceErpOrdersService.sqlPage(query));
  }

  @Post('/entityPage', { summary: 'entity分页查询' })
  async entityPage(@Body() query) {
    return this.ok(await this.FinanceErpOrdersService.entityPage(query));
  }
 
  @Get("/export", { summary: '导出订单数据' })
  async exportOrders() {
    try {
      // 从数据库中获取订单数据
      const orders = await this.FinanceErpOrdersEntity.find();

      if (orders.length === 0) {
        return this.fail('没有可导出的订单数据');
      }

      // 将订单数据转换为二维数组（Excel 表格格式）
      const rows = orders.map(order => [
        // order.main_order_number,
        // order.sub_order_number,
        // order.selected_goods,
        // order.product_specification,
        // order.product_quantity,
        // 可以根据实际需要添加其他字段
      ]);

      // 在第一行添加表头
      const headers = ['主订单号', '子订单号', '选择商品', '商品规格', '商品数量'];
      rows.unshift(headers);

      // 使用 node-xlsx 将数据转换为 Excel 格式
      const buffer = xlsx.build([{ name: "订单数据", data: rows ,options: {}}]);

      // 设置导出文件的名称
      const fileName = "订单数据.xlsx";

      // 将文件发送给客户端
      this.ctx.attachment(fileName);
      this.ctx.status = 200;
      this.ctx.body = buffer;
    } catch (err) {
      console.error('Export Error:', err);
      return this.fail('导出失败: ' + err.message);
    }
  }

    /**
   * 导出
   */
    @Get("/export2")
    async export() {
      const data = [
        ["姓名", "年龄"],
        ["啊平", 18],
        ["江帅", 19],
      ];
      const buffer = xlsx.build([
        {
          name: "成员",
          data: data,
          options: {}, // 添加空 options 以匹配类型定义
        },
      ]);
    
      const fileName = "导出.xlsx";
      this.ctx.attachment(fileName);
      this.ctx.status = 200;
      this.ctx.body = buffer;
    }

  @Post('/import', { summary: '导入订单数据' })
  async importExcel(@Files() files) {
    try {
      // 检查文件对象是否存在
      if (!files || files.length === 0) {
        return this.fail('未上传文件');
      }

      // 读取第一个文件
      const file = files[0];
      console.log('Uploaded File:', file);

      // 确保文件路径存在
      if (!file.data) {
        return this.fail('文件路径不存在');
      }

      // 使用 node-xlsx 解析文件
      const workSheets = xlsx.parse(fs.readFileSync(file.data));
      console.log('Parsed Data:', workSheets);

      // 示例：处理 Excel 数据
      for (const sheet of workSheets) {
        const rows = sheet.data;
        console.log('Sheet Rows:', rows);

        // 跳过表头，保存到数据库
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          await this.FinanceErpOrdersEntity.save({
            // main_order_number: row[0],
            // sub_order_number: row[1],
            // selected_goods: row[2],
            // product_specification: row[3],
            // product_quantity: row[4],
            // 根据具体表头字段映射数据
          });
        }
      }

      // 返回成功
      return this.ok({ message: '导入成功' });
    } catch (err) {
      console.error('Import Error:', err);
      return this.fail('导入失败: ' + err.message);
    } finally {
      // 删除临时文件
      if (files[0]?.filepath) {
        fs.unlinkSync(files[0].filepath);
      }
    }
  }
}