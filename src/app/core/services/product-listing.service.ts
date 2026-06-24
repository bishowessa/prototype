import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import type { ProductCardDto } from '@app/core/models';

export interface Product extends ProductCardDto {
  id: number;
  matchScore?: number;
  type?: string; 
}

export interface SpecGroup {
  name: string;
  icon: string;
  items: { label: string; value: string }[];
}

export interface VendorInfo {
  name: string;
  price: string;
  url: string;
  availability: string;
  letter: string;
}

export interface ProductDetails extends Product {
  reviews: number;
  specGroups: SpecGroup[];
  vendors: VendorInfo[];
}

export interface AiSummary {
  summaryText: string;
  requiresLogin?: boolean; 
}

export interface ProductSearchFilters {
  type: string;
  q?: string;
  brands?: string;
  maxPrice?: number;
  storage?: string;
  ram?: string;
  sort?: string;
}

export interface FilterMetadata {
  brands: string[];
  minPrice: number;
  maxPrice: number;
  specs: { [key: string]: string[] }; 
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  errorCode: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ProductListingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1'; 

  selectedIds = signal<number[]>([]);

  toggleComparison(id: number) {
    this.selectedIds.update(current => 
      current.includes(id) ? current.filter(itemId => itemId !== id) : [...current, id]
    );
  }

  setSelection(id: number) {
    this.selectedIds.set([id]);
  }

  clearComparison() {
    this.selectedIds.set([]);
  }

  private mapToFrontendProduct(backendItem: any): Product {
    if (!backendItem) return {} as Product;

    let specs: any = {};
    try {
      specs = backendItem.specs ? JSON.parse(backendItem.specs) : {};
    } catch (e) {}

    let finalPrice = 'Check Price';
    if (backendItem.price) {
      finalPrice = `${backendItem.price} EGP`;
    } else if (specs.price) {
      finalPrice = `${specs.price} EGP`;
    }

    const finalImage = backendItem.imageUrl || specs.imageUrl || specs.url_image || 'https://placehold.co/400x400?text=No+Image';
    const finalRating = backendItem.rating || specs.rating || 'N/A';

    return {
      id: backendItem.id,
      title: backendItem.name || 'Unknown Product',
      subtitle: backendItem.brand || backendItem.categoryName || '',
      type: backendItem.categorySlug, // Will now be 'phone' from backend
      price: finalPrice,
      rating: finalRating.toString(),
      imageUrl: finalImage,
      imageAlt: backendItem.name || 'Product image',
      showMatchBadge: backendItem.showMatchBadge || false,
      matchScore: backendItem.matchScore
    };
  }

  private mapToProductDetails(backendItem: any): ProductDetails {
    const baseProduct = this.mapToFrontendProduct(backendItem);
    
    let parsed: any = {};
    try { 
      parsed = backendItem.specs ? JSON.parse(backendItem.specs) : {}; 
    } catch (e) { 
      console.error('Failed to parse specs', e); 
    }

    const vendors: VendorInfo[] = [];
    if (parsed.source || parsed.url || parsed.price) {
      const vendorName = parsed.source || 'Official Store';
      vendors.push({
        name: vendorName,
        letter: vendorName.charAt(0).toUpperCase(),
        price: parsed.price ? `${parsed.price} EGP` : baseProduct.price,
        url: parsed.url || '#',
        availability: 'In Stock' 
      });
    }

    const groupsMap = new Map<string, SpecGroup>();
    const getGroup = (name: string, icon: string) => {
      if (!groupsMap.has(name)) groupsMap.set(name, { name, icon, items: [] });
      return groupsMap.get(name)!;
    };

    const ignoreKeys = ['url', 'source', 'price', 'id', 'name', 'brand'];

    for (const [key, value] of Object.entries(parsed)) {
      if (value === null || value === '' || Array.isArray(value)) continue;
      if (ignoreKeys.includes(key.toLowerCase())) continue;

      let label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      let groupName = 'General';
      let icon = 'info';

      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('camera')) { groupName = 'Camera'; icon = 'photo_camera'; }
      else if (lowerKey.includes('battery')) { groupName = 'Battery'; icon = 'battery_charging_full'; }
      else if (lowerKey.includes('display') || lowerKey.includes('screen')) { groupName = 'Display'; icon = 'smartphone'; }
      else if (lowerKey.includes('os') || lowerKey.includes('processor')) { groupName = 'Platform'; icon = 'memory'; }
      else if (lowerKey.includes('width') || lowerKey.includes('height')) { groupName = 'Design'; icon = 'straighten'; }
      else if (lowerKey.includes('usb') || lowerKey.includes('sim')) { groupName = 'Connectivity'; icon = 'wifi'; }

      getGroup(groupName, icon).items.push({ label, value: String(value) });
    }

    return {
      ...baseProduct,
      reviews: backendItem.review_count || backendItem.reviews || 0,
      specGroups: Array.from(groupsMap.values()),
      vendors
    };
  }

  getTrendingProducts(): Observable<Product[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/products/trending`).pipe(
      map(response => (response.data || []).map(item => this.mapToFrontendProduct(item))),
      catchError(() => of([]))
    );
  }

  getFilterMetadata(type: string): Observable<FilterMetadata> {
    return this.http.get<ApiResponse<FilterMetadata>>(`${this.apiUrl}/filters`, {
      params: new HttpParams().set('type', type)
    }).pipe(
      map(response => response.data || { brands: [], minPrice: 0, maxPrice: 5000, specs: {} })
    );
  }
  
  getProducts(filters: ProductSearchFilters): Observable<Product[]> {
    let params = new HttpParams().set('type', filters.type);
    if (filters.q) params = params.set('q', filters.q);
    if (filters.brands) params = params.set('brands', filters.brands);
    if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
    if (filters.storage) params = params.set('storage', filters.storage);
    if (filters.ram) params = params.set('ram', filters.ram);
    if (filters.sort) params = params.set('sort', filters.sort);
    
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/products`, { params }).pipe(
      map(response => (response.data || []).map(item => this.mapToFrontendProduct(item))),
      catchError(() => of([]))
    );
  }

  getProductById(id: number): Observable<ProductDetails> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/products/${id}`).pipe(
      map(response => {
        if (!response.data) throw new Error('Not found');
        return this.mapToProductDetails(response.data);
      })
    );
  }

  getProductsByIds(ids: number[]): Observable<ProductDetails[]> {
    const params = new HttpParams().set('ids', ids.join(','));
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/products/batch`, { params }).pipe(
      map(response => (response.data || []).map(item => this.mapToProductDetails(item)))
    );
  }

  getAiSummaryForProduct(id: number): Observable<AiSummary> {
    return this.http.get<ApiResponse<AiSummary>>(`${this.apiUrl}/products/${id}/ai-summary`).pipe(
      map(response => response.data || { summaryText: 'AI summary unavailable.' })
    );
  }

  getAiComparisonSummary(ids: number[]): Observable<AiSummary> {
    const params = new HttpParams().set('ids', ids.join(','));
    return this.http.get<ApiResponse<AiSummary>>(`${this.apiUrl}/products/compare/ai-summary`, { params }).pipe(
      map(response => response.data || { summaryText: 'AI comparison unavailable.' })
    );
  }
}