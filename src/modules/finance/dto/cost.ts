import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  FinanceCostEntity
} from '../entity/cost';
import { Rule, RuleType } from '@midwayjs/validate';
/**
 * 成本表
 */
export class FinanceCostQueryDTO extends FinanceCostEntity {

  @Rule(RuleType.number().optional())
  page?: number;

  @Rule(RuleType.number().optional())
  size?: number;
  @Rule(RuleType.string().optional())
  keyWord?: string;
}