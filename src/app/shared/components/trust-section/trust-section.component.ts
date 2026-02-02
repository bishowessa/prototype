import { Component, input } from '@angular/core';
import { IconComponent } from '@app/shared/components/icon/icon.component';

export interface TrustItem {
  title: string;
  description: string;
}

@Component({
  selector: 'app-trust-section',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './trust-section.component.html',
})
export class TrustSectionComponent {
  readonly badgeIcon = input<string>('verified_user');
  readonly badgeText = input<string>('Trust & Transparency');
  readonly heading = input<string>('Powered by unbiased data.');
  readonly paragraph = input<string>(
    'Our LLM-driven engine analyzes thousands of reviews and technical documents to give you estimated real-world performance metrics, not just marketing fluff.'
  );
  readonly buttonLabel = input<string>('Learn How It Works');
  readonly items = input.required<TrustItem[]>();
}
