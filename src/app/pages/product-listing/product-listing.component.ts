import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '@app/shared/components/navbar/navbar.component';
import { LandingFooterComponent } from '@app/shared/components/landing-footer/landing-footer.component';
import { ProductListingService, Product, FilterMetadata, ProductSearchFilters } from '@app/core/services/product-listing.service';
import { ProductCardComponent } from '@app/shared/components/product-card/product-card.component';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-product-listing',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent, LandingFooterComponent, ProductCardComponent],
  templateUrl: './product-listing.component.html'
})
export class ProductListingComponent implements OnInit {
  private readonly productListingService = inject(ProductListingService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  
  readonly products = signal<Product[]>([]);
  readonly isLoading = signal(true);
  readonly pageTitle = signal('Products');
  readonly selectedIds = this.productListingService.selectedIds;

  readonly availableFilters = signal<FilterMetadata>({
    brands: [], minPrice: 0, maxPrice: 5000, specs: {}
  });

  activeFilters = {
    type: 'phone', // Updated from 'mobile'
    q: '',
    brands: [] as string[],
    maxPrice: 5000,
    storage: [] as string[],
    ram: [] as string[],
    sort: 'Best Match'
  };

  private lastFetchedType = '';

  ngOnInit() {
    this.route.queryParams.pipe(
      tap(params => {
        this.isLoading.set(true);
        this.activeFilters.type = params['type'] || 'phone'; // Updated default
        this.activeFilters.q = params['q'] || '';
        this.activeFilters.brands = params['brands'] ? params['brands'].split(',') : [];
        this.activeFilters.maxPrice = params['maxPrice'] ? Number(params['maxPrice']) : 5000;
        this.activeFilters.storage = params['storage'] ? params['storage'].split(',') : [];
        this.activeFilters.ram = params['ram'] ? params['ram'].split(',') : [];
        this.activeFilters.sort = params['sort'] || 'Best Match';

        this.pageTitle.set(this.activeFilters.q ? `Results for "${this.activeFilters.q}"` : `${this.activeFilters.type}s`);

        if (this.activeFilters.type !== this.lastFetchedType) {
          this.productListingService.getFilterMetadata(this.activeFilters.type).subscribe(meta => {
            this.availableFilters.set(meta);
            if (this.activeFilters.maxPrice > meta.maxPrice) this.activeFilters.maxPrice = meta.maxPrice;
          });
          this.lastFetchedType = this.activeFilters.type;
        }
      }),
      switchMap(() => {
        const filters: ProductSearchFilters = {
          type: this.activeFilters.type,
          q: this.activeFilters.q || undefined,
          brands: this.activeFilters.brands.length ? this.activeFilters.brands.join(',') : undefined,
          maxPrice: this.activeFilters.maxPrice,
          storage: this.activeFilters.storage.length ? this.activeFilters.storage.join(',') : undefined,
          ram: this.activeFilters.ram.length ? this.activeFilters.ram.join(',') : undefined,
          sort: this.activeFilters.sort
        };
        return this.productListingService.getProducts(filters);
      }),
      catchError(() => of([]))
    ).subscribe(data => {
      this.products.set(data);
      this.isLoading.set(false);
    });
  }

  onSearch() { this.updateUrl(); }

  onTypeChange() {
    this.activeFilters.brands = [];
    this.activeFilters.storage = [];
    this.activeFilters.ram = [];
    this.updateUrl();
  }

  toggleArrayFilter(category: 'brands' | 'storage' | 'ram', value: string) {
    const list = this.activeFilters[category];
    this.activeFilters[category] = list.includes(value) ? list.filter(v => v !== value) : [...list, value];
    this.updateUrl();
  }

  onPriceChange(event: Event) {
    this.activeFilters.maxPrice = Number((event.target as HTMLInputElement).value);
    this.updateUrl();
  }

  private updateUrl() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { 
        type: this.activeFilters.type,
        q: this.activeFilters.q || null,
        brands: this.activeFilters.brands.length ? this.activeFilters.brands.join(',') : null,
        maxPrice: this.activeFilters.maxPrice,
        storage: this.activeFilters.storage.length ? this.activeFilters.storage.join(',') : null,
        ram: this.activeFilters.ram.length ? this.activeFilters.ram.join(',') : null,
        sort: this.activeFilters.sort !== 'Best Match' ? this.activeFilters.sort : null
      }
    });
  }

  toggleCompare(id: number) { this.productListingService.toggleComparison(id); }
  goToComparison() { this.router.navigate(['/compare']); }
}