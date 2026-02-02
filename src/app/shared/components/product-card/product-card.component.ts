import { Component, input } from '@angular/core';
import { IconComponent } from '@app/shared/components/icon/icon.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly price = input.required<string>();
  readonly rating = input.required<string>();
  readonly imageUrl = input.required<string>();
  readonly imageAlt = input<string>('');
  readonly showMatchBadge = input<boolean>(false);
}
