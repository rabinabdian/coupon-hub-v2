import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CouponDetailComponent } from './pages/coupon-detail/coupon-detail.component';

export const appRoutes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'coupon/:id', component: CouponDetailComponent },
  { path: '**', redirectTo: '' },
];
