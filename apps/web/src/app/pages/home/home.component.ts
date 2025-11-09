import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CouponService, Coupon } from '../../services/coupon.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private couponService = inject(CouponService);

  coupons: Coupon[] = [];
  loading = false;
  error: string | null = null;
  searchQuery = '';
  currentPage = 1;
  pageSize = 10;

  ngOnInit(): void {
    this.loadCoupons();
  }

  loadCoupons(): void {
    this.loading = true;
    this.error = null;

    this.couponService
      .getCoupons(this.currentPage, this.pageSize, this.searchQuery)
      .subscribe({
        next: (coupons) => {
          this.coupons = coupons;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load coupons';
          this.loading = false;
          console.error('Error loading coupons:', err);
        },
      });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadCoupons();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCoupons();
  }

  nextPage(): void {
    this.currentPage++;
    this.loadCoupons();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCoupons();
    }
  }
}
