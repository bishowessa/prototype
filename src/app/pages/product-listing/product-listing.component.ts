import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { NavbarComponent } from '@app/shared/components/navbar/navbar.component';
import { LandingFooterComponent } from '@app/shared/components/landing-footer/landing-footer.component';
import { ProductListingService } from '@app/core/services/product-listing.service';
import { ProductCardComponent } from '@app/shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-listing',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink, 
    NavbarComponent, 
    LandingFooterComponent,
    ProductCardComponent // Added
  ],
  templateUrl: './product-listing.component.html',
  styles: []
})
export class ProductListingComponent {
  private readonly productListingService = inject(ProductListingService);
  private readonly router = inject(Router);
  
  readonly products$ = this.productListingService.getProducts();
  readonly selectedIds = this.productListingService.selectedIds;

  toggleCompare(id: number) {
    this.productListingService.toggleComparison(id);
  }

  goToComparison() {
    this.router.navigate(['/compare']);
  }
}