import { AppDataSource } from '../data-source';
import { Merchant } from '../../entities/merchant.entity';
import { Category } from '../../entities/category.entity';
import { Coupon } from '../../entities/coupon.entity';
import { CouponCategory } from '../../entities/coupon-category.entity';

async function seed() {
  console.log('Initializing database connection...');
  await AppDataSource.initialize();

  console.log('Starting seed...');

  const merchantRepository = AppDataSource.getRepository(Merchant);
  const categoryRepository = AppDataSource.getRepository(Category);
  const couponRepository = AppDataSource.getRepository(Coupon);
  const couponCategoryRepository = AppDataSource.getRepository(CouponCategory);

  // Create merchants
  console.log('Creating merchants...');
  const merchant1 = merchantRepository.create({
    name: 'Amazon',
    description: 'Online shopping marketplace',
    website: 'https://www.amazon.com',
    logoUrl: 'https://example.com/logos/amazon.png',
    isActive: true,
  });

  const merchant2 = merchantRepository.create({
    name: 'Target',
    description: 'Retail corporation',
    website: 'https://www.target.com',
    logoUrl: 'https://example.com/logos/target.png',
    isActive: true,
  });

  const merchant3 = merchantRepository.create({
    name: 'Best Buy',
    description: 'Consumer electronics retailer',
    website: 'https://www.bestbuy.com',
    logoUrl: 'https://example.com/logos/bestbuy.png',
    isActive: true,
  });

  await merchantRepository.save([merchant1, merchant2, merchant3]);
  console.log('Merchants created!');

  // Create categories
  console.log('Creating categories...');
  const category1 = categoryRepository.create({
    name: 'Electronics',
    description: 'Electronics and gadgets',
    slug: 'electronics',
  });

  const category2 = categoryRepository.create({
    name: 'Clothing',
    description: 'Fashion and apparel',
    slug: 'clothing',
  });

  const category3 = categoryRepository.create({
    name: 'Home & Garden',
    description: 'Home improvement and garden supplies',
    slug: 'home-garden',
  });

  const category4 = categoryRepository.create({
    name: 'Food & Beverage',
    description: 'Food, drinks and groceries',
    slug: 'food-beverage',
  });

  await categoryRepository.save([category1, category2, category3, category4]);
  console.log('Categories created!');

  // Create coupons
  console.log('Creating coupons...');
  const coupon1 = couponRepository.create({
    title: '20% Off Electronics',
    description: 'Get 20% off on all electronics',
    code: 'ELEC20',
    discountAmount: 20,
    discountType: 'percentage',
    expiresAt: new Date('2025-12-31'),
    isActive: true,
    merchantId: merchant1.id,
  });

  const coupon2 = couponRepository.create({
    title: '$10 Off Purchase',
    description: 'Save $10 on orders over $50',
    code: 'SAVE10',
    discountAmount: 10,
    discountType: 'fixed',
    expiresAt: new Date('2025-06-30'),
    isActive: true,
    merchantId: merchant2.id,
  });

  const coupon3 = couponRepository.create({
    title: '15% Off Home Items',
    description: 'Get 15% off home and garden products',
    code: 'HOME15',
    discountAmount: 15,
    discountType: 'percentage',
    expiresAt: new Date('2025-09-30'),
    isActive: true,
    merchantId: merchant2.id,
  });

  const coupon4 = couponRepository.create({
    title: '$50 Off TV',
    description: 'Save $50 on TVs over $500',
    code: 'TV50',
    discountAmount: 50,
    discountType: 'fixed',
    expiresAt: new Date('2025-11-30'),
    isActive: true,
    merchantId: merchant3.id,
  });

  const coupon5 = couponRepository.create({
    title: '25% Off Clothing',
    description: 'Get 25% off all clothing items',
    code: 'FASHION25',
    discountAmount: 25,
    discountType: 'percentage',
    expiresAt: new Date('2025-08-31'),
    isActive: true,
    merchantId: merchant1.id,
  });

  await couponRepository.save([coupon1, coupon2, coupon3, coupon4, coupon5]);
  console.log('Coupons created!');

  // Link coupons to categories
  console.log('Linking coupons to categories...');
  const couponCategories = [
    couponCategoryRepository.create({ couponId: coupon1.id, categoryId: category1.id }),
    couponCategoryRepository.create({ couponId: coupon2.id, categoryId: category2.id }),
    couponCategoryRepository.create({ couponId: coupon3.id, categoryId: category3.id }),
    couponCategoryRepository.create({ couponId: coupon4.id, categoryId: category1.id }),
    couponCategoryRepository.create({ couponId: coupon5.id, categoryId: category2.id }),
  ];

  await couponCategoryRepository.save(couponCategories);
  console.log('Coupon-category links created!');

  console.log('Seed completed successfully!');
  await AppDataSource.destroy();
}

seed()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
