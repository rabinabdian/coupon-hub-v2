import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CouponsService } from './coupons.service';
import { Coupon } from '../../entities';

describe('CouponsService', () => {
  let service: CouponsService;
  let repository: Repository<Coupon>;

  const mockCoupon: Partial<Coupon> = {
    id: '1',
    title: 'Test Coupon',
    code: 'TEST20',
    discountAmount: 20,
    discountType: 'percentage',
    isActive: true,
    merchantId: 'merchant-1',
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CouponsService,
        {
          provide: getRepositoryToken(Coupon),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CouponsService>(CouponsService);
    repository = module.get<Repository<Coupon>>(getRepositoryToken(Coupon));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of active coupons', async () => {
      const expectedCoupons = [mockCoupon];
      mockRepository.find.mockResolvedValue(expectedCoupons);

      const result = await service.findAll();

      expect(result).toEqual(expectedCoupons);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['merchant', 'couponCategories', 'couponCategories.category'],
        where: { isActive: true },
      });
    });
  });

  describe('findOne', () => {
    it('should return a coupon by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockCoupon);

      const result = await service.findOne('1');

      expect(result).toEqual(mockCoupon);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['merchant', 'couponCategories', 'couponCategories.category'],
      });
    });
  });

  describe('findByMerchant', () => {
    it('should return coupons for a specific merchant', async () => {
      const expectedCoupons = [mockCoupon];
      mockRepository.find.mockResolvedValue(expectedCoupons);

      const result = await service.findByMerchant('merchant-1');

      expect(result).toEqual(expectedCoupons);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { merchantId: 'merchant-1', isActive: true },
        relations: ['merchant', 'couponCategories', 'couponCategories.category'],
      });
    });
  });
});
