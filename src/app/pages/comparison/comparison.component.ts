import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '@app/shared/components/navbar/navbar.component';
import { LandingFooterComponent } from '@app/shared/components/landing-footer/landing-footer.component';
import { ProductListingService } from '@app/core/services/product-listing.service';

@Component({
  selector: 'app-comparison',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NavbarComponent,
    LandingFooterComponent
  ],
  templateUrl: './comparison.component.html',
  styles: []
})
export class ComparisonComponent {
  private readonly productListingService = inject(ProductListingService);

  // Retrieve the selected objects based on the IDs stored in the service
  selectedProducts = this.productListingService.getSelectedProducts();

  // Helper to maintain the "Dummy Data" requirement for non-dynamic fields
  // We just cycle through these values so columns look slightly different
  readonly dummySpecs = [
    { processor: 'Snapdragon 8 Gen 2', ram: '12GB LPDDR5X', battery: '5,000 mAh', display: '6.8" AMOLED 2X' },
    { processor: 'A17 Pro', ram: '8GB LPDDR5', battery: '4,422 mAh', display: '6.7" Super Retina' },
    { processor: 'Google Tensor G3', ram: '12GB LPDDR5', battery: '5,050 mAh', display: '6.7" OLED' },
    { processor: 'Dimensity 9300', ram: '16GB LPDDR5T', battery: '5,400 mAh', display: '6.82" LTPO' },
  ];

  clearAll() {
    this.productListingService.clearComparison();
    this.selectedProducts = []; // Update local view immediately
  }
}