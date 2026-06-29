import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '@app/shared/components/icon/icon.component';
import { Router, RouterLink } from '@angular/router';
import { AuthStateService } from '@app/core/services/auth-state.service';
import { ProductListingService } from '@app/core/services/product-listing.service';
import { PRODUCT_CATEGORY_OPTIONS } from '@app/core/config/product-categories.config';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [IconComponent, RouterLink, FormsModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private readonly router = inject(Router);
  private readonly authState = inject(AuthStateService);
  private readonly productListingService = inject(ProductListingService);

  protected readonly categories = PRODUCT_CATEGORY_OPTIONS;

  protected readonly isConsumerLoggedIn = this.authState.isConsumerLoggedIn;
  protected readonly isAdmin = this.authState.isAdmin;
  protected readonly consumerEmail = this.authState.consumerEmail;
  protected readonly adminEmail = this.authState.email;
  protected readonly showUserMenu = computed(
    () => this.isConsumerLoggedIn() || this.isAdmin(),
  );
  protected readonly displayEmail = computed(
    () => this.consumerEmail() ?? this.adminEmail() ?? 'Account',
  );
  protected readonly compareCount = computed(
    () => this.productListingService.selectedIds().length,
  );
  protected readonly compareBadgeClass = computed(() =>
    this.compareCount() >= 4 ? 'bg-red-500' : 'bg-primary',
  );

  protected readonly userMenuOpen = signal(false);
  protected readonly categoriesMenuOpen = signal(false);
  protected searchQuery = '';

  protected navigateToHome(): void {
    void this.router.navigate(['/']);
  }

  protected toggleCategoriesMenu(): void {
    this.categoriesMenuOpen.update((open) => !open);
    this.userMenuOpen.set(false);
  }

  protected toggleUserMenu(): void {
    this.userMenuOpen.update((open) => !open);
    this.categoriesMenuOpen.set(false);
  }

  protected navigateToCategory(type: string): void {
    this.categoriesMenuOpen.set(false);
    void this.router.navigate(['/products'], { queryParams: { type } });
  }

  protected onSearchSubmit(): void {
    const q = this.searchQuery.trim();
    void this.router.navigate(['/products'], {
      queryParams: q ? { q } : {},
    });
  }

  protected viewProfile(): void {
    this.userMenuOpen.set(false);
    void this.router.navigate(['/onboarding', '5'], { queryParams: { view: 'true' } });
  }

  protected openAdminDashboard(): void {
    this.userMenuOpen.set(false);
    void this.router.navigate(['/admin/products']);
  }

  protected logout(): void {
    this.userMenuOpen.set(false);
    if (this.isAdmin()) {
      this.authState.adminLogout();
      return;
    }
    this.authState.consumerLogout();
  }

  @HostListener('document:click')
  protected closeMenusOnOutsideClick(): void {
    this.userMenuOpen.set(false);
    this.categoriesMenuOpen.set(false);
  }
}
