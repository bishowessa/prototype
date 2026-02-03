import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '@app/shared/components/icon/icon.component';

@Component({
  selector: 'app-onboarding-header',
  standalone: true,
  imports: [IconComponent],
  template: `
    <header
      class="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md px-6 py-4 lg:px-20"
    >
      <div class="flex items-center gap-4">
        <div class="text-primary">
          <app-icon name="manage_search" size="xl" />
        </div>
        <h2 class="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
          SmartCompare
        </h2>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium text-slate-500 dark:text-slate-400">
          {{ stepLabel }}
        </span>
        <div class="w-32 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            class="h-full bg-primary rounded-full transition-all"
            [style.width.%]="stepProgress * 100"
          ></div>
        </div>
      </div>
      <div class="hidden md:block">
        <button
          type="button"
          (click)="onSignOut()"
          class="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </header>
  `,
})
export class OnboardingHeaderComponent {
  @Input() stepLabel!: string;
  @Input() stepProgress!: number;
  @Output() signOut = new EventEmitter<void>();

  private readonly router = inject(Router);

  protected onSignOut(): void {
    this.signOut.emit();
    this.router.navigate(['/login']);
  }
}
