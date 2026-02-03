import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { NavbarComponent } from '@app/shared/components/navbar/navbar.component';
import { LandingFooterComponent } from '@app/shared/components/landing-footer/landing-footer.component';
import { HeroSectionComponent } from '@app/shared/components/hero-section/hero-section.component';
import { FeatureCardComponent } from '@app/shared/components/feature-card/feature-card.component';
import { ProductCardComponent } from '@app/shared/components/product-card/product-card.component';
import type { TrustItem } from '@app/shared/components/trust-section/trust-section.component';
import { TrustSectionComponent } from '@app/shared/components/trust-section/trust-section.component';
import { ProductListingService } from '@app/core/services/product-listing.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    AsyncPipe,
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
  private readonly productListingService = inject(ProductListingService);

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

  protected readonly trendingProducts$ = this.productListingService.getTrendingProducts();

  protected readonly trustItems: TrustItem[] = [
    {
      title: 'Transparent Estimates',
      description: 'We clearly label AI-predicted specs versus manufacturer stated specs.',
    },
    {
      title: 'Real User Sentiment',
      description: 'Aggregated sentiment analysis from verified purchase reviews.',
    },
    {
      title: 'No Sponsored bias',
      description: 'Our comparison algorithm ranks purely on value and performance matches.',
    },
  ];
}
