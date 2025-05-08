import { BaseEntity } from '@cool-midway/core';
import { FinanceStockEntity } from '../entity/stock';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Rule, RuleType } from '@midwayjs/validate';


/**
 * 库存表
 */
export class FinanceStockQueryDTO extends FinanceStockEntity {
  @Rule(RuleType.number().optional())
  page?: number;

  @Rule(RuleType.number().optional())
  size?: number;

  @Rule(RuleType.string().optional())
  keyWord?: string;
}