import { Routes } from '@angular/router';
import { consumerAuthGuard } from '@app/core/guards/consumer-auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@app/pages/landing-page/landing-page').then((m) => m.LandingPage),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('@app/pages/product-listing/product-listing.component').then(
        (m) => m.ProductListingComponent,
      ),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('@app/pages/product-details/product-details.component').then(
        (m) => m.ProductDetailsComponent,
      ),
  },
  {
    path: 'compare',
    loadComponent: () =>
      import('@app/pages/comparison/comparison.component').then((m) => m.ComparisonComponent),
  },
  {
    path: 'onboarding',
    canActivate: [consumerAuthGuard],
    loadChildren: () =>
      import('@app/pages/onboarding/onboarding.routes').then((m) => m.onboardingRoutes),
  },
  {
    path: 'login',
    loadComponent: () => import('@app/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('@app/pages/signup/signup.component').then((m) => m.SignUpComponent),
  },
  {
    path: 'admin',
    loadChildren: () => import('@app/admin/admin.routes').then((m) => m.adminRoutes),
  },
  { path: '**', redirectTo: '' },
];
