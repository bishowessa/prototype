import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@app/pages/landing-page/landing-page').then((m) => m.LandingPage),
  },
  // --- New Routes for Demo ---
  {
    path: 'products',
    loadComponent: () => import('@app/pages/product-listing/product-listing.component').then(m => m.ProductListingComponent),
  },
  {
    path: 'products/:id',
    loadComponent: () => import('@app/pages/product-details/product-details.component').then(m => m.ProductDetailsComponent),
  },
  {
    path: 'compare',
    loadComponent: () => import('@app/pages/comparison/comparison.component').then(m => m.ComparisonComponent),
  },
  // --- Existing Routes ---
  {
    path: 'onboarding',
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
  { path: '**', redirectTo: '' },
];