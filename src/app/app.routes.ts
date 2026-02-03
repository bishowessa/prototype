import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@app/pages/landing-page/landing-page').then((m) => m.LandingPage),
  },
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
