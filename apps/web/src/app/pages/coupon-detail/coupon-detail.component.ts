import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CouponService, Coupon } from '../../services/coupon.service';

@Component({
  selector: 'app-coupon-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './coupon-detail.component.html',
  styleUrl: './coupon-detail.component.css',
})
export class CouponDetailComponent implements OnInit {
  private couponService = inject(CouponService);
  private route = inject(ActivatedRoute);

  coupon: Coupon | null = null;
  loading = false;
  error: string | null = null;
  copied = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCoupon(id);
    }
  }

  loadCoupon(id: string): void {
    this.loading = true;
    this.error = null;

    this.couponService.getCouponById(id).subscribe({
      next: (coupon) => {
        this.coupon = coupon;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load coupon details';
        this.loading = false;
        console.error('Error loading coupon:', err);
      },
    });
  }

  copyCode(): void {
    if (this.coupon) {
      navigator.clipboard.writeText(this.coupon.code).then(() => {
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 2000);
      });
    }
  }
}
