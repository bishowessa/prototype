import { Component, inject } from '@angular/core';
import { ToastService } from '@app/core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    @if (toast.message(); as message) {
      <div
        class="fixed bottom-6 right-6 z-9999 flex max-w-sm items-start gap-3 rounded-xl border border-amber-200 border-l-4 border-l-amber-500 bg-amber-50 px-4 py-3 text-amber-900 shadow-lg dark:border-amber-900/50 dark:bg-amber-950 dark:text-amber-100 animate-fade-in-up"
        role="status"
      >
        <span class="material-symbols-outlined text-xl!">warning</span>
        <p class="flex-1 text-sm font-medium leading-snug">{{ message }}</p>
        <button
          type="button"
          (click)="toast.dismiss()"
          class="rounded-md p-1 text-amber-700 transition-colors hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900/40"
          aria-label="Dismiss notification"
        >
          <span class="material-symbols-outlined text-lg!">close</span>
        </button>
      </div>
    }
  `,
})
export class ToastComponent {
  protected readonly toast = inject(ToastService);
}
