import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from '../../entities';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private couponsRepository: Repository<Coupon>
  ) {}

  async findAll(): Promise<Coupon[]> {
    return this.couponsRepository.find({
      relations: ['merchant', 'couponCategories', 'couponCategories.category'],
      where: { isActive: true },
    });
  }

  async findOne(id: string): Promise<Coupon> {
    return this.couponsRepository.findOne({
      where: { id },
      relations: ['merchant', 'couponCategories', 'couponCategories.category'],
    });
  }

  async findByMerchant(merchantId: string): Promise<Coupon[]> {
    return this.couponsRepository.find({
      where: { merchantId, isActive: true },
      relations: ['merchant', 'couponCategories', 'couponCategories.category'],
    });
  }
}
