import { Component, EventEmitter, Input, Output, Optional } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StepNavigationButtonComponent } from '@app/shared/components/step-navigation-button/step-navigation-button.component';

@Component({
  selector: 'app-base-device-preferences',
  standalone: true,
  imports: [StepNavigationButtonComponent],
  template: `
    <div
      class="max-w-4xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
    >
      <div class="p-8 md:p-12">
        <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 class="text-3xl font-black text-slate-900 dark:text-white mb-2">{{ title }}</h1>
            <p class="text-slate-500 dark:text-slate-400">
              {{ description }}
            </p>
          </div>
        </div>

        <div class="flex-col flex gap-4">
          <ng-content />
          
          @if (form && form.invalid && form.touched) {
            <div class="text-sm text-red-600 dark:text-red-400">
              Please fill in all required fields.
            </div>
          }
          
          <div
            class="pt-8 flex items-center justify-end border-t border-slate-100 dark:border-slate-800"
          >
            <app-step-navigation-button
              variant="primary"
              type="button"
              [disabled]="isSaving"
              [icon]="submitIcon"
              (click)="onSubmit()"
            >
              {{ isSaving ? 'Saving...' : submitLabel }}
            </app-step-navigation-button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class BaseDevicePreferencesComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() form?: FormGroup;
  @Input() submitLabel = 'Next Step';
  @Input() submitIcon = 'arrow_forward';
  @Input() isSaving = false;
  @Output() readonly save = new EventEmitter<void>();

  protected onSubmit(): void {
    if (this.form) {
      // Mark all fields as touched to show validation errors
      this.form.markAllAsTouched();
      
      if (this.form.valid) {
        this.save.emit();
      }
    } else {
      // If no form, emit directly (for backward compatibility)
      this.save.emit();
    }
  }
}
