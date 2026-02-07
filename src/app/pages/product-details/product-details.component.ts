import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
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
  private readonly productListingService = inject(ProductListingService);

  // 1. Listen to URL changes (e.g. /products/1)
  // 2. Extract the 'id'
  // 3. Fetch the matching product from the service
  readonly product$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    map((id) => (id ? +id : null)),
    switchMap((id) =>
      id ? this.productListingService.getProductById(id) : []
    )
  );
}