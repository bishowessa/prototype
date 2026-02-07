import { Component, input, Output, EventEmitter } from '@angular/core';
import { IconComponent } from '@app/shared/components/icon/icon.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  // --- Existing Signals ---
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly price = input.required<string>();
  readonly rating = input.required<string>();
  readonly imageUrl = input.required<string>();
  readonly imageAlt = input<string>('');
  readonly showMatchBadge = input<boolean>(false);
  
  // New Input for the % Score
  readonly matchScore = input<number | undefined>(undefined);

  // --- Selection Logic ---
  readonly isSelected = input<boolean>(false);
  @Output() toggleSelect = new EventEmitter<void>();

  preventPropagation(event: Event) {
    event.stopPropagation();
    event.preventDefault();
  }

  onToggle() {
    this.toggleSelect.emit();
  }
}