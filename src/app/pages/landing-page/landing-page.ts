import { Component } from '@angular/core';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { NavbarComponent } from '@app/shared/components/navbar/navbar.component';
import { LandingFooterComponent } from '@app/shared/components/landing-footer/landing-footer.component';
import { HeroSectionComponent } from '@app/shared/components/hero-section/hero-section.component';
import { FeatureCardComponent } from '@app/shared/components/feature-card/feature-card.component';
import { ProductCardComponent } from '@app/shared/components/product-card/product-card.component';
import type { TrustItem } from '@app/shared/components/trust-section/trust-section.component';
import { TrustSectionComponent } from '@app/shared/components/trust-section/trust-section.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    IconComponent,
    NavbarComponent,
    LandingFooterComponent,
    HeroSectionComponent,
    FeatureCardComponent,
    ProductCardComponent,
    TrustSectionComponent,
  ],
  templateUrl: './landing-page.html',
})
export class LandingPage {
  protected readonly features = [
    {
      icon: 'psychology',
      title: 'AI Personalization',
      description:
        'Get tailored recommendations based on your specific usage patterns and budget, not just generic lists.',
    },
    {
      icon: 'trending_down',
      title: 'Price Tracking',
      description:
        'Visualize real-time price history and set smart alerts to catch price drops the moment they happen.',
    },
    {
      icon: 'table_view',
      title: 'Deep Spec Comparison',
      description:
        'Generate comprehensive side-by-side technical tables instantly to spot the smallest differences.',
    },
  ] as const;

  protected readonly products = [
    {
      title: 'MacBook Pro M3',
      subtitle: '14-inch, 1TB SSD',
      price: '$1,599',
      rating: '4.9',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDOwWRjVUMMdRVV-sH8V9OdFk0AiAS6JF3FYaSTDa9GjH1xb50ufSHPou6t6ynkQqte34BzlngxNj8XJ51qex0OYRi2DYiR6XWMexeQB8kt9siFnOF15-5iVF782hNR_FaxOF2tRa9eovj1YGOe06hHYgX8yO4e9r9rce-xp4VGtI60ie5coAE6x8RlfrAZOMo70OK1W2E9yXTSqe0emKOGHmpPMUPVm6EuQLFQj2jonJQIlF0pbp6UuPlbxIqz0uDpr7Yp3xijyH8',
      imageAlt: 'MacBook Pro laptop showing screen on desk',
      showMatchBadge: true,
    },
    {
      title: 'Dell XPS 15',
      subtitle: 'OLED, i9 Processor',
      price: '$1,299',
      rating: '4.7',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDANfDc8eW81jl4npIkoS3sgK7HR5EG1psVRtK2M7i1bMBGTivvAEAAtO1zhL-m55j01Nk4NIOi_HCEfKgTezBDvTK0Qe5Y5CfpaBXwZ-t3-p-fh3d-B5aTHZeg42YUl2tXb2cKqE1JdtZO19I51wyPtq2D1G9yabV5_xZFLoaeIaBO8aeH8d6_1IsFb4blSk7b9X9NSkBF9G3otO952fDiW22SmV-tai4ppkK9cpS3em_hBGtLbTkLsEPgZ1GLH80tWwok8jU8LJ4',
      imageAlt: 'Dell XPS laptop open on a table',
      showMatchBadge: true,
    },
    {
      title: 'iPhone 15 Pro',
      subtitle: 'Titanium, 256GB',
      price: '$999',
      rating: '4.8',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDepKB7P43C-j6rjVMyos_Pe8FX3KANJ6VxNKtMX_-9EeKN3rLRZ13MGnbJ2PF2AmNc0wkJtjjXrP8L0lx8CcC8BXDb4f80mQuAhxkXQz3ukxVx2PNk3yzcS0u1dJyHKsuPLNLra5FwfSwla0ELwnl0dv5DiXFySUabPXHrFKcLWdIrDCMf4Wf3-h4HUEiRcS7xNthgHphPxv8AaRHrCaPhKNJE1QsXMbXcnj-qPcuwOnjcxbpviXmDJwXiZTaUNmOgDoc0YIsuv0I',
      imageAlt: 'Titanium smartphone back view',
      showMatchBadge: true,
    },
    {
      title: 'Samsung S24 Ultra',
      subtitle: 'Titanium Grey, 512GB',
      price: '$1,299',
      rating: '4.8',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCaFKC4xUEJkAs0ERGbGvGSaFoPuWca8U2ZQC1XhpcVhBHZyWbl1xHrZDDwibZahDE56_1Jxi4LzQJDDqfw6aCv9vxWcUkzcxiGqPuFO8XHKPNUl2tt2rfWILA3i5FNiURVCY-ZpRwCuPF2mgkrH9_lKosOpiQr8Vwr1-bDyvLT6TP3gOn2KbAKee2UFJs6QWhuqvlYJ3BCvS9Dxjv8vjQ9gLsuAA6oNosPnYzZcJTmXfVdaWHOAfvKicrZlczZ_31aQ5siPODumIU',
      imageAlt: 'Android smartphone with stylus pen',
      showMatchBadge: false,
    },
  ] as const;

  protected readonly trustItems: TrustItem[] = [
    {
      title: 'Transparent Estimates',
      description:
        'We clearly label AI-predicted specs versus manufacturer stated specs.',
    },
    {
      title: 'Real User Sentiment',
      description:
        'Aggregated sentiment analysis from verified purchase reviews.',
    },
    {
      title: 'No Sponsored bias',
      description:
        'Our comparison algorithm ranks purely on value and performance matches.',
    },
  ];
}
