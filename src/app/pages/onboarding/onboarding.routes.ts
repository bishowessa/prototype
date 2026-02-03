import { Routes } from '@angular/router';
import { OnboardingLayoutComponent } from './onboarding-layout.component';
import { onboardingStepGuard } from './guards/onboarding-step.guard';

export const onboardingRoutes: Routes = [
  {
    path: '',
    component: OnboardingLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '1',
        pathMatch: 'full',
      },
      {
        path: ':stepId',
        component: OnboardingLayoutComponent,
        canActivate: [onboardingStepGuard],
      },
    ],
  },
];
