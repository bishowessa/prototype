import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http'; // NEW
import { NavbarComponent } from '@app/shared/components/navbar/navbar.component';
import { LandingFooterComponent } from '@app/shared/components/landing-footer/landing-footer.component';
import { MarkdownContentComponent } from '@app/shared/components/markdown-content/markdown-content.component';
import { ProductListingService, ProductDetails, AiSummary } from '@app/core/services/product-listing.service';

interface CompareRow {
  label: string;
  values: string[];
  estimated: boolean[];
  isDifferent: boolean;
}

interface CompareGroup {
  groupName: string;
  icon: string;
  rows: CompareRow[];
}

@Component({
  selector: 'app-comparison',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, LandingFooterComponent, MarkdownContentComponent],
  templateUrl: './comparison.component.html',
  styles: []
})
export class ComparisonComponent implements OnInit {
  private readonly productListingService = inject(ProductListingService);

  selectedProducts: ProductDetails[] = [];
  compareGroups: CompareGroup[] = [];
  
  aiSummary = signal<AiSummary | null>(null);
  isLoading = signal(true);
  hasError = signal(false);

  ngOnInit() {
    const ids = this.productListingService.selectedIds();
    
    if (ids.length > 0) {
      this.isLoading.set(true);
      
      this.productListingService.getProductsByIds(ids).subscribe({
        next: (products) => {
          if (products && products.length > 0) {
            this.selectedProducts = products;
            this.buildComparisonTable(products);
            this.fetchAiSummary(ids); 
          } else {
            this.hasError.set(true); 
          }
          this.isLoading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to load batch products:', err);
          console.error('Backend 400 Rejection:', err.error);
          this.hasError.set(true);
          this.isLoading.set(false);
        },
      });
    } else {
      this.isLoading.set(false);
    }
  }

  fetchAiSummary(ids: number[]) {
    this.productListingService.getAiComparisonSummary(ids).subscribe({
      next: (ai) => this.aiSummary.set(ai),
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load AI comparison summary:', err);
        console.error('Backend rejection body:', err.error);
        // SMART ERROR HANDLING: Check if it's an Auth Error
        if (err.status === 401 || err.status === 403) {
           this.aiSummary.set({ 
             summaryText: 'Log in to unlock AI-powered side-by-side analysis.', 
             requiresLogin: true 
           });
        } else {
           this.aiSummary.set({ summaryText: 'AI comparison is currently unavailable due to a network error. Please try again later.' });
        }
      }
    });
  }

  buildComparisonTable(products: ProductDetails[]) {
     const groupMap = new Map<string, { icon: string, labels: Set<string> }>();
     
     products.forEach(p => {
       p.specGroups?.forEach(g => {
         if (!groupMap.has(g.name)) {
           groupMap.set(g.name, { icon: g.icon, labels: new Set() });
         }
         g.items.forEach(item => {
           groupMap.get(g.name)!.labels.add(item.label);
         });
       });
     });

     const result: CompareGroup[] = [];
     groupMap.forEach((data, groupName) => {
       const rows: CompareRow[] = [];
       data.labels.forEach(label => {
         const values = products.map(p => {
           const group = p.specGroups?.find(g => g.name === groupName);
           if (group) {
             const item = group.items.find(i => i.label === label);
             return item ? item.value : '-'; 
           }
           return '-';
         });
         const estimated = products.map(p => {
           const group = p.specGroups?.find(g => g.name === groupName);
           if (group) {
             const item = group.items.find(i => i.label === label);
             return item?.isEstimated ?? false;
           }
           return false;
         });
         rows.push({ label, values, estimated, isDifferent: this.valuesDiffer(values) });
       });
       result.push({ groupName, icon: data.icon, rows });
     });
     
     this.compareGroups = result;
  }

  private valuesDiffer(values: string[]): boolean {
    if (values.length <= 1) {
      return false;
    }

    const normalized = values.map((value) => value.trim());
    return !normalized.every((value) => value === normalized[0]);
  }

  clearAll() {
    this.productListingService.clearComparison();
    this.selectedProducts = []; 
    this.compareGroups = [];
    this.aiSummary.set(null); 
    this.hasError.set(false);
  }

  getBestVendor(product: ProductDetails) {
     if (product.vendors && product.vendors.length > 0) {
        return product.vendors[0]; 
     }
     return null;
  }
}