import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  FinanceGroupLeaderServiceFeeEntity
} from '../entity/groupLeaderServiceFee';
import { Rule, RuleType } from '@midwayjs/validate';
/**
 * 团长服务费表
 */
export class FinanceGroupLeaderServiceFeeQueryDTO extends FinanceGroupLeaderServiceFeeEntity {

  @Rule(RuleType.number().optional())
  page?: number;

  @Rule(RuleType.number().optional())
  size?: number;
  @Rule(RuleType.string().optional())
  keyWord?: string;
}