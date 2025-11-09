import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { Coupon } from '../../entities';

@ApiTags('coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active coupons' })
  @ApiResponse({ status: 200, description: 'List of active coupons', type: [Coupon] })
  findAll(): Promise<Coupon[]> {
    return this.couponsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get coupon by ID' })
  @ApiResponse({ status: 200, description: 'Coupon details', type: Coupon })
  findOne(@Param('id') id: string): Promise<Coupon> {
    return this.couponsService.findOne(id);
  }

  @Get('merchant/:merchantId')
  @ApiOperation({ summary: 'Get coupons by merchant' })
  @ApiResponse({ status: 200, description: 'List of merchant coupons', type: [Coupon] })
  findByMerchant(@Param('merchantId') merchantId: string): Promise<Coupon[]> {
    return this.couponsService.findByMerchant(merchantId);
  }
}
