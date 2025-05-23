import { FinanceErpOrdersEntity } from '../entity/erpOrders';
import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, FindOptionsWhere, Between, Like } from 'typeorm';

const formatDate = (date: Date | null | undefined): string => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};


/**
 * ERP订单服务
 */
@Provide()
export class FinanceErpOrdersService extends BaseService {
  @InjectEntityModel(FinanceErpOrdersEntity)
  financeErpOrdersModel: Repository<FinanceErpOrdersEntity>;

  /**
   * Conditional query with pagination, supporting fuzzy matching
   * @param query - Query conditions
   */
  async list(query: any) {
    const {
      page = 1,
      size = 10,
      order_number,
      order_status,
      order_source,
      keyWord,
      transaction_time_start,
      transaction_time_end,
      ...otherParams
    } = query;

    const where: FindOptionsWhere<FinanceErpOrdersEntity> = {};

    // Fuzzy matching for string fields
    if (order_number) {
      where.order_number = Like(`%${order_number}%`);
    }
    if (order_status) {
      where.order_status = Like(`%${order_status}%`);
    }
    if (order_source) {
      where.order_source = Like(`%${order_source}%`);
    }
    if (keyWord) {
      where.order_number = Like(`%${keyWord}%`);
    }

    // Date range condition for transaction_time
    // if (transaction_time_start && transaction_time_end) {
    //   where.transaction_time = Between(new Date(transaction_time_start), new Date(transaction_time_end));
    // }

    // Other dynamic conditions (exact match)
    Object.keys(otherParams).forEach(key => {
      if (otherParams[key] && FinanceErpOrdersEntity.prototype.hasOwnProperty(key)) {
        where[key] = otherParams[key];
      }
    });

    const [list, total] = await this.financeErpOrdersModel.findAndCount({
      where,
      skip: (page - 1) * size,
      take: size,
    });

    return { list, total };
  }

  /**
   * Export data with conditions using TypeORM
   * @param query - Query conditions
   */
  async export(query: any) {
    const where: FindOptionsWhere<FinanceErpOrdersEntity> = {};

    // Apply same conditions as list method
    const {
      order_number,
      order_status,
      order_source,
      transaction_time_start,
      transaction_time_end,
      ...otherParams
    } = query;

    if (order_number) {
      where.order_number = Like(`%${order_number}%`);
    }
    if (order_status) {
      where.order_status = Like(`%${order_status}%`);
    }
    if (order_source) {
      where.order_source = Like(`%${order_source}%`);
    }


    Object.keys(otherParams).forEach(key => {
      if (otherParams[key] && FinanceErpOrdersEntity.prototype.hasOwnProperty(key)) {
        where[key] = otherParams[key];
      }
    });

    const data = await this.financeErpOrdersModel.find({ where });

    // Define export headers with Chinese labels
    const headers = [
      { key: 'gen_data_time', label: '数据时间' , isDate: true },
      { key: 'order_number', label: '订单编号' },
      { key: 'platform_type', label: '平台类型' },
      { key: 'shop_name', label: '店铺名称' },
      { key: 'order_source', label: '订单来源' },
      { key: 'warehouse_name', label: '仓库名称' },
      { key: 'warehouse_type', label: '仓库类型' },
      { key: 'original_order_no', label: '原始单号' },
      { key: 'order_status', label: '订单状态' },
      { key: 'shipping_status', label: '发货状态' },
      { key: 'platform_shipping_status', label: '平台发货状态' },
      { key: 'order_type', label: '订单类型' },
      { key: 'shipping_condition', label: '发货条件' },
      { key: 'freeze_reason', label: '冻结原因' },
      { key: 'refund_status', label: '退款状态' },
      { key: 'distribution_category', label: '分销类别' },
      { key: 'distributor_name', label: '分销商名称' },
      { key: 'distributor_code', label: '分销商编号' },
      { key: 'distribution_original_order_no', label: '分销原始单号' },
      { key: 'order_time', label: '下单时间' , isDate: true },
      { key: 'payment_time', label: '付款时间' , isDate: true },
      { key: 'shipping_countdown', label: '发货倒计时' },
      { key: 'buyer_payment_account', label: '买家付款账号' },
      { key: 'customer_nickname', label: '客户网名' },
      { key: 'recipient_name', label: '收件人' },
      { key: 'province_city_county', label: '省市县' },
      { key: 'address', label: '地址' },
      { key: 'mobile_phone', label: '手机' },
      { key: 'telephone', label: '电话' },
      { key: 'postcode', label: '邮编' },
      { key: 'area', label: '区域' },
      { key: 'big_pen', label: '大头笔' },
      { key: 'dispatch_time', label: '派送时间' , isDate: true },
      { key: 'logistics_company', label: '物流公司' },
      { key: 'logistics_number', label: '物流单号' },
      { key: 'buyer_message', label: '买家留言' },
      { key: 'customer_service_remark', label: '客服备注' },
      { key: 'flag', label: '标旗' },
      { key: 'print_remark', label: '打印备注' },
      { key: 'product_variety_count', label: '货品种类数' },
      { key: 'product_total_count', label: '货品总数' },
      { key: 'product_total_amount', label: '货品总额' },
      { key: 'shipping_fee', label: '邮资' },
      { key: 'other_fees', label: '其它费用' },
      { key: 'discount', label: '优惠' },
      { key: 'receivable_amount', label: '应收金额' },
      { key: 'output_tax', label: '销项税' },
      { key: 'payment_on_delivery_amount', label: '款到发货金额' },
      { key: 'cod_amount', label: 'COD金额' },
      { key: 'buyer_cod_fee', label: '买家COD费用' },
      { key: 'commission', label: '佣金' },
      { key: 'product_estimated_cost', label: '货品预估成本' },
      { key: 'shipping_estimated_cost', label: '邮资预估成本' },
      { key: 'paid_amount', label: '已付金额' },
      { key: 'estimated_weight', label: '预估重量' },
      { key: 'estimated_gross_profit', label: '预估毛利' },
      { key: 'invoice_type', label: '发票类型' },
      { key: 'invoice_title', label: '发票抬头' },
      { key: 'invoice_content', label: '发票内容' },
      { key: 'salesman', label: '业务员' },
      { key: 'auditor', label: '审核人' },
      { key: 'financial_auditor', label: '财审人' },
      { key: 'sign_out_person', label: '签出人' },
      { key: 'outbound_order_no', label: '出库单号' },
      { key: 'mark_name', label: '标记名称' },
      { key: 'processing_days', label: '处理天数' },
      { key: 'product_merchant_code', label: '货品商家编码' },
      { key: 'original_product_quantity', label: '原始货品数量' },
      { key: 'original_product_variety_count', label: '原始货品种类数' },
      { key: 'submission_time', label: '递交时间' , isDate: true },
      { key: 'currency', label: '币种' },
      { key: 'online_package_split_count', label: '线上包裹拆分数' },
      { key: 'activation_time', label: '激活时间' , isDate: true },
      { key: 'invoice_issued', label: '已开具发票' },
      { key: 'volume', label: '体积' },
      { key: 'order_tags', label: '订单标签' },
      { key: 'order_exception', label: '订单异常' },
      { key: 'note', label: '便签' },
      { key: 'id_number', label: '证件号码' },
      { key: 'buyer_actual_payment', label: '买家实付' },
      { key: 'latest_delivery_time', label: '最晚送达时间' , isDate: true},
      { key: 'platform_tags', label: '平台标签' },
    ];

    // Format data for export
    const exportData = data.map(item => {
      const row: { [key: string]: any } = {};
      headers.forEach(header => {
        if (header.isDate) {
          row[header.key] = formatDate(item[header.key]);
        } else {
          row[header.key] = item[header.key] ?? '';
        }
      });
      return row;
    });

    return { headers, data: exportData };
  }

  /**
   * Import ERP orders from Excel data
   * @param data - Parsed Excel data
   */
  async import(data: any[]) {
    const safeTrim = (value: any) => {
      if (value === '-') {
        return null; // Handle "-" as null
      }
      if (typeof value === 'string') {
        // Remove problematic characters
        return value.trim().replace(/[\0\b\n\r\t\\'"\x1a]/g, '');
      }
      return value;
    };
    const safeDate = (value: any): Date | null => {
      if (!value || value === '-') {
        return null; // Handle falsy values or "-" as null
      }
      try {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return null; // Handle invalid dates
        }
        // Set time to 00:00:00 to keep only year, month, day
        date.setHours(0, 0, 0, 0);
        return date;
      } catch {
        return null; // Handle errors during date parsing
      }
    };


    const entities = data.map(item => {
      const entity = new FinanceErpOrdersEntity();

      // String fields
      entity.order_number = safeTrim(item['订单编号']) ?? null;
      entity.platform_type = safeTrim(item['平台类型']) ?? null;
      entity.shop_name = safeTrim(item['店铺名称']) ?? null;
      entity.order_source = safeTrim(item['订单来源']) ?? null;
      entity.warehouse_name = safeTrim(item['仓库名称']) ?? null;
      entity.warehouse_type = safeTrim(item['仓库类型']) ?? null;
      entity.original_order_no = safeTrim(item['原始单号']) ?? null;
      entity.order_status = safeTrim(item['订单状态']) ?? null;
      entity.shipping_status = safeTrim(item['发货状态']) ?? null;
      entity.platform_shipping_status = safeTrim(item['平台发货状态']) ?? null;
      entity.order_type = safeTrim(item['订单类型']) ?? null;
      entity.shipping_condition = safeTrim(item['发货条件']) ?? null;
      entity.freeze_reason = safeTrim(item['冻结原因']) ?? null;
      entity.refund_status = safeTrim(item['退款状态']) ?? null;
      entity.distribution_category = safeTrim(item['分销类别']) ?? null;
      entity.distributor_name = safeTrim(item['分销商名称']) ?? null;
      entity.distributor_code = safeTrim(item['分销商编号']) ?? null;
      entity.distribution_original_order_no = safeTrim(item['分销原始单号']) ?? null;
      entity.shipping_countdown = safeTrim(item['发货倒计时']) ?? null;
      entity.buyer_payment_account = safeTrim(item['买家付款账号']) ?? null;
      entity.customer_nickname = safeTrim(item['客户网名']) ?? null;
      entity.recipient_name = safeTrim(item['收件人']) ?? null;
      entity.province_city_county = safeTrim(item['省市县']) ?? null;
      entity.address = safeTrim(item['地址']) ?? null;
      entity.mobile_phone = safeTrim(item['手机']) ?? null;
      entity.telephone = safeTrim(item['电话']) ?? null;
      entity.postcode = safeTrim(item['邮编']) ?? null;
      entity.area = safeTrim(item['区域']) ?? null;
      entity.big_pen = safeTrim(item['大头笔']) ?? null;
      entity.logistics_company = safeTrim(item['物流公司']) ?? null;
      entity.logistics_number = safeTrim(item['物流单号']) ?? null;
      entity.buyer_message = safeTrim(item['买家留言']) ?? null;
      entity.customer_service_remark = safeTrim(item['客服备注']) ?? null;
      entity.flag = safeTrim(item['标旗']) ?? null;
      entity.print_remark = safeTrim(item['打印备注']) ?? null;
      entity.note = safeTrim(item['便签']) ?? null;
      entity.invoice_type = safeTrim(item['发票类型']) ?? null;
      entity.invoice_title = safeTrim(item['发票抬头']) ?? null;
      entity.invoice_content = safeTrim(item['发票内容']) ?? null;
      entity.salesman = safeTrim(item['业务员']) ?? null;
      entity.auditor = safeTrim(item['审核人']) ?? null;
      entity.financial_auditor = safeTrim(item['财审人']) ?? null;
      entity.sign_out_person = safeTrim(item['签出人']) ?? null;
      entity.outbound_order_no = safeTrim(item['出库单号']) ?? null;
      entity.mark_name = safeTrim(item['标记名称']) ?? null;
      entity.product_merchant_code = safeTrim(item['货品商家编码']) ?? null;
      entity.currency = safeTrim(item['币种']) ?? null;
      entity.invoice_issued = safeTrim(item['已开具发票']) ?? 'false';
      entity.order_tags = safeTrim(item['订单标签']) ?? null;
      entity.order_exception = safeTrim(item['订单异常']) ?? null;
      entity.id_number = safeTrim(item['证件号码']) ?? null;
      entity.platform_tags = safeTrim(item['平台标签']) ?? null;

      // Date fields
      entity.gen_data_time = item['数据时间'] ? safeDate(item['数据时间']) : null;
      entity.order_time = item['下单时间'] ? safeDate(item['下单时间']) : null;
      entity.payment_time = item['付款时间'] ? safeDate(item['付款时间']) : null;
      entity.dispatch_time = item['派送时间'] ? safeDate(item['派送时间']) : null;
      entity.activation_time = item['激活时间'] ? safeDate(item['激活时间']) : null;
      entity.submission_time = item['递交时间'] ? safeDate(item['递交时间']) : null;
      entity.latest_delivery_time = item['最晚送达时间'] ? safeDate(item['最晚送达时间']) : null;

      // Numeric fields
      entity.product_variety_count = parseInt(item['货品种类数'], 10) || null;
      entity.product_total_count = parseInt(item['货品总数'], 10) || null;
      entity.product_total_amount = parseFloat(item['货品总额']) || null;
      entity.shipping_fee = parseFloat(item['邮资']) || null;
      entity.other_fees = parseFloat(item['其它费用']) || null;
      entity.discount = parseFloat(item['优惠']) || null;
      entity.receivable_amount = parseFloat(item['应收金额']) || null;
      entity.output_tax = parseFloat(item['销项税']) || null;
      entity.payment_on_delivery_amount = parseFloat(item['款到发货金额']) || null;
      entity.cod_amount = parseFloat(item['COD金额']) || null;
      entity.buyer_cod_fee = parseFloat(item['买家COD费用']) || null;
      entity.commission = parseFloat(item['佣金']) || null;
      entity.product_estimated_cost = parseFloat(item['货品预估成本']) || null;
      entity.shipping_estimated_cost = parseFloat(item['邮资预估成本']) || null;
      entity.paid_amount = parseFloat(item['已付金额']) || null;
      entity.estimated_weight = parseFloat(item['预估重量']) || null;
      entity.estimated_gross_profit = parseFloat(item['预估毛利']) || null;
      entity.processing_days = parseInt(item['处理天数'], 10) || null;
      entity.original_product_quantity = parseInt(item['原始货品数量'], 10) || null;
      entity.original_product_variety_count = parseInt(item['原始货品种类数'], 10) || null;
      entity.online_package_split_count = parseInt(item['线上包裹拆分数'], 10) || null;
      entity.volume = parseFloat(item['体积']) || null;
      entity.buyer_actual_payment = parseFloat(item['买家实付']) || null;

      return entity;
    });

    // ---
    // Check for missing '数据时间' before saving
    // ---
    const missingDateEntity = entities.find(entity => entity.gen_data_time === null);
    if (missingDateEntity) {
      return { success: false, message: '数据时间必填' };
    }
    // Batch save
    await this.financeErpOrdersModel.save(entities);
    return { success: true, count: entities.length };
  }
}