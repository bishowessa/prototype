import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'warning' | 'error' | 'success';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  readonly message = signal<string | null>(null);
  readonly variant = signal<ToastVariant>('warning');

  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  showWarning(message: string, durationMs = 3000): void {
    this.show(message, 'warning', durationMs);
  }

  show(message: string, variant: ToastVariant = 'warning', durationMs = 3000): void {
    if (this.hideTimer != null) {
      clearTimeout(this.hideTimer);
    }

    this.variant.set(variant);
    this.message.set(message);

    this.hideTimer = setTimeout(() => this.dismiss(), durationMs);
  }

  dismiss(): void {
    if (this.hideTimer != null) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }

    this.message.set(null);
  }
}
