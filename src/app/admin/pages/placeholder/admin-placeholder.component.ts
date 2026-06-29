import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IconComponent } from '@app/shared/components/icon/icon.component';

@Component({
  selector: 'app-admin-placeholder',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div
      class="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-800"
    >
      <div
        class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-primary dark:bg-blue-900/50"
      >
        <app-icon name="construction" />
      </div>
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{{ title }}</h1>
      <p class="mt-2 text-slate-500 dark:text-slate-400">This section is not implemented yet.</p>
    </div>
  `,
})
export class AdminPlaceholderComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly title = this.route.snapshot.data['title'] as string;
}
