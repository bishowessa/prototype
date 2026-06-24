import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http'; // NEW
import { ProductListingService, ProductDetails, AiSummary } from '@app/core/services/product-listing.service';
import { NavbarComponent } from '@app/shared/components/navbar/navbar.component';
import { LandingFooterComponent } from '@app/shared/components/landing-footer/landing-footer.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, LandingFooterComponent], 
  templateUrl: './product-details.component.html',
  styles: []
})
export class ProductDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productListingService = inject(ProductListingService);

  readonly product = signal<ProductDetails | null>(null);
  readonly aiSummary = signal<AiSummary | null>(null);
  readonly hasError = signal(false);
  readonly isLoading = signal(true);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchData(+id);
      }
    });
  }

  fetchData(id: number) {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.aiSummary.set(null); 

    this.productListingService.getProductById(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load product:', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });

    this.productListingService.getAiSummaryForProduct(id).subscribe({
      next: (data) => this.aiSummary.set(data),
      error: (err: HttpErrorResponse) => {
        // SMART ERROR HANDLING: Check if it's an Auth Error
        if (err.status === 401 || err.status === 403) {
          this.aiSummary.set({ 
            summaryText: 'Log in to unlock personalized AI insights for this product.', 
            requiresLogin: true 
          });
        } else {
          this.aiSummary.set({ summaryText: 'AI insights are currently unavailable due to a network error.' });
        }
      }
    });
  }

  compareProduct(id: number) {
    this.productListingService.setSelection(id);
    this.router.navigate(['/compare']);
  }
}