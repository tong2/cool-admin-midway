import { FinanceErpOrdersEntity } from '../entity/erpOrders';
import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, FindOptionsWhere, Between, Like } from 'typeorm';

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
    if (transaction_time_start && transaction_time_end) {
      where.transaction_time = Between(new Date(transaction_time_start), new Date(transaction_time_end));
    }

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
    if (transaction_time_start && transaction_time_end) {
      where.transaction_time = Between(new Date(transaction_time_start), new Date(transaction_time_end));
    }

    Object.keys(otherParams).forEach(key => {
      if (otherParams[key] && FinanceErpOrdersEntity.prototype.hasOwnProperty(key)) {
        where[key] = otherParams[key];
      }
    });

    const data = await this.financeErpOrdersModel.find({ where });

    // Define export headers with Chinese labels
    const headers = [
      { key: 'order_number', label: '订单编号' },
      { key: 'shop', label: '店铺' },
      { key: 'order_source', label: '订单来源' },
      { key: 'warehouse', label: '仓库' },
      { key: 'sub_order_original_number', label: '子单原始单号' },
      { key: 'order_status', label: '订单状态' },
      { key: 'order_type', label: '订单类型' },
      { key: 'cash_on_delivery', label: '货到付款' },
      { key: 'order_refund_status', label: '订单退款状态' },
      { key: 'transaction_time', label: '交易时间' },
      { key: 'payment_time', label: '付款时间' },
      { key: 'delivery_time', label: '发货时间' },
      { key: 'customer_nickname', label: '客户网名' },
      { key: 'recipient_name', label: '收件人' },
      { key: 'recipient_region', label: '收货地区' },
      { key: 'recipient_address', label: '收货地址' },
      { key: 'recipient_phone', label: '收件人手机' },
      { key: 'distributor', label: '分销商' },
      { key: 'sub_order_original_sub_number', label: '子单原始子单号' },
      { key: 'source_bundle_number', label: '来源组合装编号' },
      { key: 'customer_number', label: '客户编号' },
      { key: 'recipient_telephone', label: '收件人电话' },
      { key: 'postcode', label: '邮编' },
      { key: 'area', label: '区域' },
      { key: 'logistics_company', label: '物流公司' },
      { key: 'logistics_number', label: '物流单号' },
      { key: 'buyer_message', label: '买家留言' },
      { key: 'customer_service_remark', label: '客服备注' },
      { key: 'print_remark', label: '打印备注' },
      { key: 'remark', label: '备注' },
      { key: 'customer_service_flag', label: '客服标旗' },
      { key: 'order_payment_amount', label: '订单支付金额' },
      { key: 'postage', label: '邮费' },
      { key: 'other_fees', label: '其它费用' },
      { key: 'order_total_discount', label: '订单总优惠' },
      { key: 'receivable_amount', label: '应收金额' },
      { key: 'payment_on_delivery_amount', label: '款到发货金额' },
      { key: 'cash_on_delivery_amount', label: '货到付款金额' },
      { key: 'order_estimated_cost', label: '订单预估成本' },
      { key: 'postage_cost', label: '邮资成本' },
      { key: 'estimated_weight', label: '预估重量' },
      { key: 'need_invoice', label: '需要发票' },
      { key: 'invoice_title', label: '发票抬头' },
      { key: 'invoice_content', label: '发票内容' },
      { key: 'salesman', label: '业务员' },
      { key: 'auditor', label: '审核人' },
      { key: 'financial_auditor', label: '财审人' },
      { key: 'merchant_code', label: '商家编码' },
      { key: 'product_number', label: '货品编号' },
      { key: 'product_name', label: '货品名称' },
      { key: 'specification_name', label: '规格名称' },
      { key: 'product_short_name', label: '货品简称' },
      { key: 'base_unit', label: '基本单位' },
      { key: 'platform_product_name', label: '平台货品名称' },
      { key: 'platform_specification_name', label: '平台规格名称' },
      { key: 'platform_product_id', label: '平台货品ID' },
      { key: 'platform_specification_id', label: '平台规格ID' },
      { key: 'order_quantity', label: '下单数量' },
      { key: 'list_price', label: '标价' },
      { key: 'product_total_discount', label: '货品总优惠' },
      { key: 'transaction_price', label: '成交价' },
      { key: 'apportioned_price', label: '分摊后价格' },
      { key: 'discount', label: '折扣' },
      { key: 'actual_delivery_quantity', label: '实发数量' },
      { key: 'apportioned_total_price', label: '分摊后总价' },
      { key: 'pre_refund_payment_amount', label: '退款前支付金额' },
      { key: 'apportioned_postage', label: '分摊邮费' },
      { key: 'single_item_payment_amount', label: '单品支付金额' },
      { key: 'commission', label: '佣金' },
      { key: 'split_from_bundle', label: '拆自组合装' },
      { key: 'estimated_weight_per_item', label: '估重' },
      { key: 'gift_method', label: '赠品方式' },
      { key: 'id_number', label: '证件号码' },
      { key: 'mark_name', label: '标记名称' },
      { key: 'activation_time', label: '激活时间' },
      { key: 'dispatch_time', label: '派送时间' },
    ];

    // Format data for export
    const exportData = data.map(item => {
      const row: { [key: string]: any } = {};
      headers.forEach(header => {
        row[header.key] = item[header.key] instanceof Date ? item[header.key].toISOString() : item[header.key] ?? '';
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

    const entities = data.map(item => {
      const entity = new FinanceErpOrdersEntity();

      // String fields
      entity.order_number = safeTrim(item['订单编号']) ?? null;
      entity.shop = safeTrim(item['店铺']) ?? null;
      entity.order_source = safeTrim(item['订单来源']) ?? null;
      entity.warehouse = safeTrim(item['仓库']) ?? null;
      entity.sub_order_original_number = safeTrim(item['子单原始单号']) ?? null;
      entity.order_status = safeTrim(item['订单状态']) ?? null;
      entity.order_type = safeTrim(item['订单类型']) ?? null;
      entity.cash_on_delivery = safeTrim(item['货到付款']) ?? 'false';
      entity.order_refund_status = safeTrim(item['订单退款状态']) ?? null;
      entity.customer_nickname = safeTrim(item['客户网名']) ?? null;
      entity.recipient_name = safeTrim(item['收件人']) ?? null;
      entity.recipient_region = safeTrim(item['收货地区']) ?? null;
      entity.recipient_address = safeTrim(item['收货地址']) ?? null;
      entity.recipient_phone = safeTrim(item['收件人手机']) ?? null;
      entity.distributor = safeTrim(item['分销商']) ?? null;
      entity.sub_order_original_sub_number = safeTrim(item['子单原始子单号']) ?? null;
      entity.source_bundle_number = safeTrim(item['来源组合装编号']) ?? null;
      entity.customer_number = safeTrim(item['客户编号']) ?? null;
      entity.recipient_telephone = safeTrim(item['收件人电话']) ?? null;
      entity.postcode = safeTrim(item['邮编']) ?? null;
      entity.area = safeTrim(item['区域']) ?? null;
      entity.logistics_company = safeTrim(item['物流公司']) ?? null;
      entity.logistics_number = safeTrim(item['物流单号']) ?? null;
      entity.buyer_message = safeTrim(item['买家留言']) ?? null;
      entity.customer_service_remark = safeTrim(item['客服备注']) ?? null;
      entity.print_remark = safeTrim(item['打印备注']) ?? null;
      entity.remark = safeTrim(item['备注']) ?? null;
      entity.customer_service_flag = safeTrim(item['客服标旗']) ?? null;
      entity.need_invoice = safeTrim(item['需要发票']) ?? 'false';
      entity.invoice_title = safeTrim(item['发票抬头']) ?? null;
      entity.invoice_content = safeTrim(item['发票内容']) ?? null;
      entity.salesman = safeTrim(item['业务员']) ?? null;
      entity.auditor = safeTrim(item['审核人']) ?? null;
      entity.financial_auditor = safeTrim(item['财审人']) ?? null;
      entity.merchant_code = safeTrim(item['商家编码']) ?? null;
      entity.product_number = safeTrim(item['货品编号']) ?? null;
      entity.product_name = safeTrim(item['货品名称']) ?? null;
      entity.specification_name = safeTrim(item['规格名称']) ?? null;
      entity.product_short_name = safeTrim(item['货品简称']) ?? null;
      entity.base_unit = safeTrim(item['基本单位']) ?? null;
      entity.platform_product_name = safeTrim(item['平台货品名称']) ?? null;
      entity.platform_specification_name = safeTrim(item['平台规格名称']) ?? null;
      entity.platform_product_id = safeTrim(item['平台货品ID']) ?? null;
      entity.platform_specification_id = safeTrim(item['平台规格ID']) ?? null;
      entity.split_from_bundle = safeTrim(item['拆自组合装']) ?? null;
      entity.gift_method = safeTrim(item['赠品方式']) ?? null;
      entity.id_number = safeTrim(item['证件号码']) ?? null;
      entity.mark_name = safeTrim(item['标记名称']) ?? null;

      // Date fields
      entity.transaction_time = item['交易时间'] ? new Date(item['交易时间']) : null;
      entity.payment_time = item['付款时间'] ? new Date(item['付款时间']) : null;
      entity.delivery_time = item['发货时间'] ? new Date(item['发货时间']) : null;
      entity.activation_time = item['激活时间'] ? new Date(item['激活时间']) : null;
      entity.dispatch_time = item['派送时间'] ? new Date(item['派送时间']) : null;

      // Numeric fields
      entity.order_payment_amount = parseFloat(item['订单支付金额']) || null;
      entity.postage = parseFloat(item['邮费']) || null;
      entity.other_fees = parseFloat(item['其它费用']) || null;
      entity.order_total_discount = parseFloat(item['订单总优惠']) || null;
      entity.receivable_amount = parseFloat(item['应收金额']) || null;
      entity.payment_on_delivery_amount = parseFloat(item['款到发货金额']) || null;
      entity.cash_on_delivery_amount = parseFloat(item['货到付款金额']) || null;
      entity.order_estimated_cost = parseFloat(item['订单预估成本']) || null;
      entity.postage_cost = parseFloat(item['邮资成本']) || null;
      entity.estimated_weight = parseFloat(item['预估重量']) || null;
      entity.order_quantity = parseInt(item['下单数量'], 10) || null;
      entity.list_price = parseFloat(item['标价']) || null;
      entity.product_total_discount = parseFloat(item['货品总优惠']) || null;
      entity.transaction_price = parseFloat(item['成交价']) || null;
      entity.apportioned_price = parseFloat(item['分摊后价格']) || null;
      entity.discount = parseFloat(item['折扣']) || null;
      entity.actual_delivery_quantity = parseInt(item['实发数量'], 10) || null;
      entity.apportioned_total_price = parseFloat(item['分摊后总价']) || null;
      entity.pre_refund_payment_amount = parseFloat(item['退款前支付金额']) || null;
      entity.apportioned_postage = parseFloat(item['分摊邮费']) || null;
      entity.single_item_payment_amount = parseFloat(item['单品支付金额']) || null;
      entity.commission = parseFloat(item['佣金']) || null;
      entity.estimated_weight_per_item = parseFloat(item['估重']) || null;

      return entity;
    });

    // Batch save
    await this.financeErpOrdersModel.save(entities);
    return { success: true, count: entities.length };
  }
}