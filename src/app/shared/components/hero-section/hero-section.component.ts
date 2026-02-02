import { Component, input } from '@angular/core';
import { IconComponent } from '@app/shared/components/icon/icon.component';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './hero-section.component.html',
})
export class HeroSectionComponent {
  readonly badgeIcon = input<string>('auto_awesome');
  readonly badgeText = input<string>('AI-Powered Analysis');
  readonly headline = input<string>('Compare Smart, Buy Smarter');
  readonly headlineHighlight = input<string>('Buy Smarter');
  readonly subtext = input<string>(
    'Uncover the best tech deals with AI-powered insights and deep spec analysis. Stop guessing and start knowing.'
  );
}
