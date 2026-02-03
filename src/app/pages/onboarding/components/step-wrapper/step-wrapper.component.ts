import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StepNavigationButtonComponent } from '@app/shared/components/step-navigation-button/step-navigation-button.component';

@Component({
  selector: 'app-step-wrapper',
  standalone: true,
  imports: [StepNavigationButtonComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-sm font-bold uppercase tracking-widest text-primary">
            {{ stepLabel }}
          </h2>
          @if (description) {
            <p class="text-sm text-slate-500 dark:text-slate-400">
              {{ description }}
            </p>
          }
        </div>
        @if (showBack) {
          <app-step-navigation-button variant="secondary" icon="arrow_back" (click)="back.emit()">
            Back
          </app-step-navigation-button>
        }
      </div>
      <ng-content />
    </div>
  `,
})
export class StepWrapperComponent {
  @Input() stepLabel!: string;
  @Input() description?: string;
  @Input() showBack = true;
  @Output() back = new EventEmitter<void>();
}
