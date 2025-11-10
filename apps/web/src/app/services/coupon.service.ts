import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Coupon {
  id: string;
  title: string;
  description: string;
  code: string;
  discountAmount: number;
  discountType: string;
  expiresAt: string;
  isActive: boolean;
  merchantId: string;
  merchant?: {
    id: string;
    name: string;
    website: string;
    logoUrl: string;
  };
  couponCategories?: Array<{
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getCoupons(page = 1, pageSize = 10, search?: string): Observable<Coupon[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<Coupon[]>(`${this.apiUrl}/coupons`, { params });
  }

  getCouponById(id: string): Observable<Coupon> {
    return this.http.get<Coupon>(`${this.apiUrl}/coupons/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  getCouponsByCategory(categorySlug: string): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(
      `${this.apiUrl}/coupons/category/${categorySlug}`
    );
  }
}
