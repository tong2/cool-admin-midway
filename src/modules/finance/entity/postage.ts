import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 邮资表
 */
@Entity('finance_postage')
export class FinancePostageEntity extends BaseEntity {

  @PrimaryGeneratedColumn({ comment: '主键ID' })
  id: number;

  @Column({ comment: '数据时间', nullable: false, type: 'timestamp' })
  gen_data_time: Date;

  @Column({ comment: '省份', nullable: true, type: 'varchar' })
  province: string;

  @Column({ comment: '公斤段 0-0.5KG (含打包辅材)', nullable: true, type: 'decimal', precision: 5, scale: 2 })
  weight_0_0_5kg_with_pack: number;

  @Column({ comment: '公斤段 0.51-1KG (机打 (含打包辅材))', nullable: true, type: 'decimal', precision: 5, scale: 2 })
  weight_0_51_1kg_machine_with_pack: number;

  @Column({ comment: '公斤段 1.01-2KG (贴单件)', nullable: true, type: 'decimal', precision: 5, scale: 2 })
  weight_1_01_2kg_label: number;

  @Column({ comment: '公斤段 1.01-2KG (打包品)', nullable: true, type: 'decimal', precision: 5, scale: 2 })
  weight_1_01_2kg_pack: number;

  @Column({ comment: '公斤段 2.01-3KG (贴单件)', nullable: true, type: 'decimal', precision: 5, scale: 2 })
  weight_2_01_3kg_label: number;

  @Column({ comment: '公斤段 2.01-3KG (打包品)', nullable: true, type: 'decimal', precision: 5, scale: 2 })
  weight_2_01_3kg_pack: number;

  @Column({ comment: '10公斤内 (含辅材和操作费) 首重3公斤', nullable: true, type: 'decimal', precision: 5, scale: 2 })
  ten_kg_with_fee_first_3kg: number;

  @Column({ comment: '10公斤内 (3kg以上不含辅材和操作费) 续重每公斤', nullable: true, type: 'decimal', precision: 5, scale: 2 })
  ten_kg_no_fee_additional_per_kg: number;
}