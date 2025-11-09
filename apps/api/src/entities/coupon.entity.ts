import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Merchant } from './merchant.entity';
import { CouponCategory } from './coupon-category.entity';

@Entity('coupons')
export class Coupon {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty()
  @Column()
  code: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discountAmount: number;

  @ApiProperty()
  @Column({ default: 'percentage' })
  discountType: string; // 'percentage' or 'fixed'

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  expiresAt: Date;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty()
  @Column({ type: 'uuid' })
  merchantId: string;

  @ApiProperty({ type: () => Merchant })
  @ManyToOne(() => Merchant, (merchant) => merchant.coupons)
  @JoinColumn({ name: 'merchantId' })
  merchant: Merchant;

  @ApiProperty({ type: () => [CouponCategory] })
  @OneToMany(() => CouponCategory, (couponCategory) => couponCategory.coupon)
  couponCategories: CouponCategory[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
