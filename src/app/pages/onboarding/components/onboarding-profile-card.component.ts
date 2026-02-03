import { Component, input } from '@angular/core';
import { IconComponent } from '@app/shared/components/icon/icon.component';

@Component({
  selector: 'app-onboarding-profile-card',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './onboarding-profile-card.component.html',
})
export class OnboardingProfileCardComponent {
  readonly icon = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}

