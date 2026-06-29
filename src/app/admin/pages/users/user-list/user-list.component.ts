import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminUserService } from '@app/admin/services/admin-user.service';
import { AdminUserListItemDto } from '@app/admin/models/admin-user.model';
import { IconComponent } from '@app/shared/components/icon/icon.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  private readonly userService = inject(AdminUserService);

  protected readonly pageSize = 20;

  protected readonly users = signal<AdminUserListItemDto[]>([]);
  protected readonly currentPage = signal(0);
  protected readonly totalPages = signal(0);
  protected readonly totalElements = signal(0);
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly deleteError = signal('');
  protected readonly deletingUserId = signal<number | null>(null);
  protected readonly expandedUserId = signal<number | null>(null);

  protected readonly canGoPrevious = computed(() => this.currentPage() > 0);
  protected readonly canGoNext = computed(() => {
    const total = this.totalPages();
    return total > 0 && this.currentPage() < total - 1;
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  protected toggleExpand(userId: number): void {
    this.expandedUserId.update((current) => (current === userId ? null : userId));
  }

  protected parsePreferences(json: string): { key: string; value: string }[] {
    try {
      const parsed = JSON.parse(json) as Record<string, unknown>;
      return Object.entries(parsed).map(([key, value]) => ({
        key,
        value: String(value),
      }));
    } catch {
      return [];
    }
  }

  protected preferenceCount(user: AdminUserListItemDto): number {
    return user.preferences.length;
  }

  protected goToPreviousPage(): void {
    if (!this.canGoPrevious()) {
      return;
    }

    this.currentPage.update((page) => page - 1);
    this.loadUsers();
  }

  protected goToNextPage(): void {
    if (!this.canGoNext()) {
      return;
    }

    this.currentPage.update((page) => page + 1);
    this.loadUsers();
  }

  protected deleteUser(user: AdminUserListItemDto): void {
    if (user.type === 'ADMIN' || this.deletingUserId() !== null) {
      return;
    }

    const confirmed = confirm(`Delete user "${user.email}"? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    this.deleteError.set('');
    this.deletingUserId.set(user.id);

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.deletingUserId.set(null);
        this.expandedUserId.update((current) => (current === user.id ? null : current));
        this.loadUsers();
      },
      error: (err: HttpErrorResponse) => {
        this.deletingUserId.set(null);
        this.deleteError.set(
          err.status === 403
            ? 'This account cannot be deleted.'
            : 'Failed to delete user. Please try again.',
        );
      },
    });
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.error.set('');

    this.userService.listUsers(this.currentPage(), this.pageSize).subscribe({
      next: (page) => {
        this.users.set(page.content);
        this.currentPage.set(page.page);
        this.totalPages.set(page.totalPages);
        this.totalElements.set(page.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load users. Please try again.');
        this.users.set([]);
        this.loading.set(false);
      },
    });
  }
}
