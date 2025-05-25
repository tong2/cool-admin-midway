import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  FinancePostageEntity
} from '../entity/postage';
import { Rule, RuleType } from '@midwayjs/validate';
/**
 * 邮资表
 */
export class FinancePostageQueryDTO extends FinancePostageEntity {

  @Rule(RuleType.number().optional())
  page?: number;

  @Rule(RuleType.number().optional())
  size?: number;
  @Rule(RuleType.string().optional())
  keyWord?: string;
}