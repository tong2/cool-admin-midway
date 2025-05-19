import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  FinanceFinishEntity
} from '../entity/finish';
import { Rule, RuleType } from '@midwayjs/validate';
/**
 * 完成表
 */
export class FinanceFinishQueryDTO extends FinanceFinishEntity {

  @Rule(RuleType.number().optional())
  page?: number;

  @Rule(RuleType.number().optional())
  size?: number;
  @Rule(RuleType.string().optional())
  keyWord?: string;
}