import { Component, input } from '@angular/core';
import { IconComponent } from '@app/shared/components/icon/icon.component';

@Component({
  selector: 'app-feature-card',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './feature-card.component.html',
})
export class FeatureCardComponent {
  readonly icon = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
