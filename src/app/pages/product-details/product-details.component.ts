import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router'; // Added Router
import { ProductListingService } from '@app/core/services/product-listing.service';
import { map, switchMap } from 'rxjs';
import { NavbarComponent } from '@app/shared/components/navbar/navbar.component';
import { LandingFooterComponent } from '@app/shared/components/landing-footer/landing-footer.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NavbarComponent,
    LandingFooterComponent
  ],
  templateUrl: './product-details.component.html',
  styles: []
})
export class ProductDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router); // Inject Router
  private readonly productListingService = inject(ProductListingService);

  readonly product$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    map((id) => (id ? +id : null)),
    switchMap((id) =>
      id ? this.productListingService.getProductById(id) : []
    )
  );

  // === NEW: Logic to Compare Only This Product ===
  compareProduct(id: number) {
    this.productListingService.setSelection(id); // Sets JUST this product (clears others)
    this.router.navigate(['/compare']);          // Goes to comparison page
  }
}