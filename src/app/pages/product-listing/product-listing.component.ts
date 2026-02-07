import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '@app/shared/components/navbar/navbar.component';
import { LandingFooterComponent } from '@app/shared/components/landing-footer/landing-footer.component';
import { ProductListingService, Product } from '@app/core/services/product-listing.service';
import { ProductCardComponent } from '@app/shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-listing',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink, 
    NavbarComponent, 
    LandingFooterComponent,
    ProductCardComponent
  ],
  templateUrl: './product-listing.component.html',
  styles: []
})
export class ProductListingComponent implements OnInit {
  private readonly productListingService = inject(ProductListingService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  
  // Signals
  readonly products = signal<Product[]>([]);
  readonly isLoading = signal(true);
  readonly pageTitle = signal('Phones');
  readonly selectedIds = this.productListingService.selectedIds;

  ngOnInit() {
    // 1. Fetch Data Immediately (Guaranteed to run)
    this.productListingService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });

    // 2. Listen to URL just for the Title text
    this.route.queryParams.subscribe(params => {
      const query = params['q'];
      if (query) {
        this.pageTitle.set(`Results for "${query}"`);
      } else {
        this.pageTitle.set('Phones');
      }
    });
  }

  toggleCompare(id: number) {
    this.productListingService.toggleComparison(id);
  }

  goToComparison() {
    this.router.navigate(['/compare']);
  }
}