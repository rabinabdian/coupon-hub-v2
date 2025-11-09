import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Coupon } from './coupon.entity';
import { Category } from './category.entity';

@Entity('coupon_categories')
export class CouponCategory {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'uuid' })
  couponId: string;

  @ApiProperty()
  @Column({ type: 'uuid' })
  categoryId: string;

  @ApiProperty({ type: () => Coupon })
  @ManyToOne(() => Coupon, (coupon) => coupon.couponCategories)
  @JoinColumn({ name: 'couponId' })
  coupon: Coupon;

  @ApiProperty({ type: () => Category })
  @ManyToOne(() => Category, (category) => category.couponCategories)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
