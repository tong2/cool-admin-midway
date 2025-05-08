import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { FinanceErpOrdersEntity } from '../entity/erpOrders';
import { Rule, RuleType } from '@midwayjs/validate';
/**
 * ERP订单
 */
export class FinanceErpOrdersQueryDTO extends FinanceErpOrdersEntity {

  @Rule(RuleType.number().optional())
  page?: number;

  @Rule(RuleType.number().optional())
  size?: number;

  @Rule(RuleType.string().optional())
  keyWord?: string;

}