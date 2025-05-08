import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';
import { FinanceOrdersEntity } from '../entity/orders';
import { Rule, RuleType } from '@midwayjs/validate';


/**
 * 抖音订单
 */
export class FinanceOrdersQueryDTO extends FinanceOrdersEntity {

  @Rule(RuleType.number().optional())
  page?: number;

  @Rule(RuleType.number().optional())
  size?: number;
  @Rule(RuleType.string().optional())
  keyWord?: string;
}