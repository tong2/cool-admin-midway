import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  FinanceBoxSpecEntity
} from '../entity/box_spec';
import { Rule, RuleType } from '@midwayjs/validate';
/**
 * 箱规表
 */
export class FinanceBoxSpecQueryDTO extends FinanceBoxSpecEntity {

  @Rule(RuleType.number().optional())
  page?: number;

  @Rule(RuleType.number().optional())
  size?: number;
  @Rule(RuleType.string().optional())
  keyWord?: string;
}