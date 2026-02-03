import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-step-navigation-button',
  standalone: true,
  template: `
    <button
      [type]="type"
      [class]="buttonClass"
      (click)="click.emit()"
      [disabled]="disabled"
    >
      <ng-content />
      @if (showIcon) {
        <span class="material-symbols-outlined !text-xl">{{ icon }}</span>
      }
    </button>
  `,
})
export class StepNavigationButtonComponent {
  @Input() type: 'button' | 'submit' = 'button';
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() showIcon = true;
  @Input() icon = 'arrow_forward';
  @Input() disabled = false;
  @Output() click = new EventEmitter<void>();

  protected get buttonClass(): string {
    if (this.variant === 'primary') {
      return 'w-full md:w-auto px-10 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
    }
    return 'w-full md:w-auto px-10 py-4 text-slate-500 font-bold hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center gap-2';
  }
}
