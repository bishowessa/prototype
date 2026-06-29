import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { AdminStatsService } from '@app/admin/services/admin-stats.service';
import { AdminDashboardStats } from '@app/admin/models/admin-stats.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  private readonly statsService = inject(AdminStatsService);

  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly stats = signal<AdminDashboardStats | null>(null);

  protected readonly categorySummary = computed(() => {
    const names = this.stats()?.categoryNames ?? [];
    return names.length > 0 ? names.join(', ') : 'No categories';
  });

  protected readonly quickLinks = computed(() => {
    const currentStats = this.stats();
    if (!currentStats) {
      return [];
    }

    return [
      {
        title: 'Manage Products',
        description: 'View and edit product listings by category.',
        icon: 'inventory_2',
        path: '/admin/products',
        stat: `${currentStats.totalProducts} products`,
      },
      {
        title: 'Manage Users',
        description: 'Review user accounts and their category preferences.',
        icon: 'group',
        path: '/admin/users',
        stat: `${currentStats.totalUsers} users`,
      },
    ];
  });

  ngOnInit(): void {
    this.statsService.getDashboardStats().subscribe({
      next: (dashboardStats) => {
        this.stats.set(dashboardStats);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load dashboard statistics. Please refresh the page.');
        this.loading.set(false);
      },
    });
  }
}
