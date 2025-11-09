import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1730000000000 implements MigrationInterface {
  name = 'InitialMigration1730000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

    // Create merchants table
    await queryRunner.query(`
      CREATE TABLE "merchants" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" text,
        "website" character varying,
        "logoUrl" character varying,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_merchants_id" PRIMARY KEY ("id")
      )
    `);

    // Create categories table
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" text,
        "slug" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_categories_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_categories_id" PRIMARY KEY ("id")
      )
    `);

    // Create coupons table
    await queryRunner.query(`
      CREATE TABLE "coupons" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "description" text,
        "code" character varying NOT NULL,
        "discountAmount" numeric NOT NULL,
        "discountType" character varying NOT NULL,
        "expiresAt" TIMESTAMP,
        "isActive" boolean NOT NULL DEFAULT true,
        "merchantId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_coupons_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_coupons_merchantId" FOREIGN KEY ("merchantId")
          REFERENCES "merchants"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // Create coupon_categories junction table
    await queryRunner.query(`
      CREATE TABLE "coupon_categories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "couponId" uuid NOT NULL,
        "categoryId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_coupon_categories_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_coupon_categories_couponId" FOREIGN KEY ("couponId")
          REFERENCES "coupons"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_coupon_categories_categoryId" FOREIGN KEY ("categoryId")
          REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // Create events table
    await queryRunner.query(`
      CREATE TABLE "events" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "type" character varying NOT NULL,
        "data" jsonb NOT NULL,
        "userId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_events_id" PRIMARY KEY ("id")
      )
    `);

    // Create indexes
    await queryRunner.query(`CREATE INDEX "IDX_coupons_merchantId" ON "coupons" ("merchantId")`);
    await queryRunner.query(`CREATE INDEX "IDX_coupons_isActive" ON "coupons" ("isActive")`);
    await queryRunner.query(`CREATE INDEX "IDX_coupon_categories_couponId" ON "coupon_categories" ("couponId")`);
    await queryRunner.query(`CREATE INDEX "IDX_coupon_categories_categoryId" ON "coupon_categories" ("categoryId")`);
    await queryRunner.query(`CREATE INDEX "IDX_events_type" ON "events" ("type")`);
    await queryRunner.query(`CREATE INDEX "IDX_events_userId" ON "events" ("userId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_events_userId"`);
    await queryRunner.query(`DROP INDEX "IDX_events_type"`);
    await queryRunner.query(`DROP INDEX "IDX_coupon_categories_categoryId"`);
    await queryRunner.query(`DROP INDEX "IDX_coupon_categories_couponId"`);
    await queryRunner.query(`DROP INDEX "IDX_coupons_isActive"`);
    await queryRunner.query(`DROP INDEX "IDX_coupons_merchantId"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "events"`);
    await queryRunner.query(`DROP TABLE "coupon_categories"`);
    await queryRunner.query(`DROP TABLE "coupons"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "merchants"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
