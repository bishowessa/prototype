import { Component } from '@angular/core';
import { IconComponent } from '@app/shared/components/icon/icon.component';

@Component({
  selector: 'app-onboarding-footer',
  standalone: true,
  imports: [IconComponent],
  template: `
    <footer
      class="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-8 pb-8 px-6 lg:px-20"
    >
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-xs text-slate-400">© 2024 SmartCompare Inc. All rights reserved.</p>
        <div class="flex gap-6">
          <a class="text-xs text-slate-400 hover:text-primary transition-colors" href="#"
            >Privacy Policy</a
          >
          <a class="text-xs text-slate-400 hover:text-primary transition-colors" href="#"
            >Terms of Service</a
          >
          <span class="flex items-center gap-1 text-xs text-slate-400">
            <app-icon name="language" size="sm" />
            English (US)
          </span>
        </div>
      </div>
    </footer>
  `,
})
export class OnboardingFooterComponent {}
