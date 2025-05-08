import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { FinanceTalentCommissionEntity
 } from '../entity/talentCommission';
import { Rule, RuleType } from '@midwayjs/validate';
/**
 * 达人佣金表
 */
export class FinanceTalentCommissionQueryDTO extends FinanceTalentCommissionEntity {

  @Rule(RuleType.number().optional())
  page?: number;

  @Rule(RuleType.number().optional())
  size?: number;

  @Rule(RuleType.string().optional())
  keyWord?: string;
}