import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import type { ProductCardDto } from '@app/core/models';

export interface Product extends ProductCardDto {
  id: number;
}

const DELAY_MS = 100;

const MASTER_PRODUCTS: Product[] = [
  // --- Trending Items ---
  {
    id: 101,
    title: 'MacBook Pro M3',
    subtitle: '14-inch, 1TB SSD',
    price: '$1,599',
    rating: '4.9',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOwWRjVUMMdRVV-sH8V9OdFk0AiAS6JF3FYaSTDa9GjH1xb50ufSHPou6t6ynkQqte34BzlngxNj8XJ51qex0OYRi2DYiR6XWMexeQB8kt9siFnOF15-5iVF782hNR_FaxOF2tRa9eovj1YGOe06hHYgX8yO4e9r9rce-xp4VGtI60ie5coAE6x8RlfrAZOMo70OK1W2E9yXTSqe0emKOGHmpPMUPVm6EuQLFQj2jonJQIlF0pbp6UuPlbxIqz0uDpr7Yp3xijyH8',
    imageAlt: 'MacBook Pro laptop',
    showMatchBadge: true,
  },
  {
    id: 102,
    title: 'Dell XPS 15',
    subtitle: 'OLED, i9 Processor',
    price: '$1,299',
    rating: '4.7',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDANfDc8eW81jl4npIkoS3sgK7HR5EG1psVRtK2M7i1bMBGTivvAEAAtO1zhL-m55j01Nk4NIOi_HCEfKgTezBDvTK0Qe5Y5CfpaBXwZ-t3-p-fh3d-B5aTHZeg42YUl2tXb2cKqE1JdtZO19I51wyPtq2D1G9yabV5_xZFLoaeIaBO8aeH8d6_1IsFb4blSk7b9X9NSkBF9G3otO952fDiW22SmV-tai4ppkK9cpS3em_hBGtLbTkLsEPgZ1GLH80tWwok8jU8LJ4',
    imageAlt: 'Dell XPS 15',
    showMatchBadge: true,
  },
  {
    id: 103,
    title: 'iPhone 15 Pro',
    subtitle: 'Titanium, 256GB',
    price: '$999',
    rating: '4.8',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDepKB7P43C-j6rjVMyos_Pe8FX3KANJ6VxNKtMX_-9EeKN3rLRZ13MGnbJ2PF2AmNc0wkJtjjXrP8L0lx8CcC8BXDb4f80mQuAhxkXQz3ukxVx2PNk3yzcS0u1dJyHKsuPLNLra5FwfSwla0ELwnl0dv5DiXFySUabPXHrFKcLWdIrDCMf4Wf3-h4HUEiRcS7xNthgHphPxv8AaRHrCaPhKNJE1QsXMbXcnj-qPcuwOnjcxbpviXmDJwXiZTaUNmOgDoc0YIsuv0I',
    imageAlt: 'iPhone 15 Pro',
    showMatchBadge: true,
  },
  {
    id: 104,
    title: 'Samsung S24 Ultra',
    subtitle: 'Titanium Grey, 512GB',
    price: '$1,299',
    rating: '4.8',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaFKC4xUEJkAs0ERGbGvGSaFoPuWca8U2ZQC1XhpcVhBHZyWbl1xHrZDDwibZahDE56_1Jxi4LzQJDDqfw6aCv9vxWcUkzcxiGqPuFO8XHKPNUl2tt2rfWILA3i5FNiURVCY-ZpRwCuPF2mgkrH9_lKosOpiQr8Vwr1-bDyvLT6TP3gOn2KbAKee2UFJs6QWhuqvlYJ3BCvS9Dxjv8vjQ9gLsuAA6oNosPnYzZcJTmXfVdaWHOAfvKicrZlczZ_31aQ5siPODumIU',
    imageAlt: 'Samsung S24 Ultra',
    showMatchBadge: false,
  },
  // --- Phone Items ---
  {
    id: 1,
    title: 'Optic Max Camera Phone',
    subtitle: 'Stellar Series',
    price: '$1,099',
    rating: '4.9',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwBBWIm2l1zm_ctPm_mRWnXQD-M3f-xB7BZWDPkl32gcPGOyKFA7_UgJWV22pWVqcgSg2poBQnRcfUnO3pnuj8tzeTNXWRAVAC1qr7BfnMovuHwFbYeS0FlGpUbl6wl1hE7tnJlHiQzj3LcHdKw_GkgF1ruz5OjCkG8MTEeUj30PcAR_sk_htYi0AGquGHIuYajb3BSYB7Rj2BvN-Isuh-mNDqzqb-vmBrDB-79q-21QMVsTC-NI_VsGIY94UxRkQNrCUaOZVQZcs',
    imageAlt: 'Optic Max Camera Phone',
    showMatchBadge: true,
  },
  {
    id: 2,
    title: 'Galaxy X Edition Pro',
    subtitle: 'Galaxy Edition',
    price: '$1,199',
    rating: '4.2',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_PDWreYqST9NDf-RIeDKxtvGLQaksCnX2OqZBVUTWf_hiDz0V0O7GzuoHIgTMSQvhxrAkEoTgLZVi-tQp7flEggBmq1qtSEgs4nyBL0TFduna6NNVI1i0X_YI34Oc-zewZO1Lewwbo5ZZuQoF8D8pbaKfYJFdOocRWT1tSFBwJ_xnQKNkzZO6En1-zCIffi_RxNue74NUSCFWuBHd0_UzaIpGv6mWkCt4tSLmLZB3Xwg8eUTESw4j2cquGacYSpdPJ1wiLL7LfHQ',
    imageAlt: 'Galaxy X Edition Pro',
    showMatchBadge: false,
  },
  {
    id: 3,
    title: 'Nexus Pro Fold',
    subtitle: 'Nexus Prime',
    price: '$1,799',
    rating: '4.7',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCce2XzRK0FV8TGLniOF87-C8lsaktTmRpBJoc2mnnocZMk813QmsL4bz3FCsN1ssg1YuPTzDmpy-k-5gB_akvWKDyzqN3CZ3GWPzyOXHy7prC-7U-07Me7-VI7gGklT465MXDjl6DORdN_yzqxTEtS8x051EKa_sS80lxEzrtu0bbJc0Xut1ZdRCuo369fb4pmD1VKIVKJUXgp1xk-ZIE7wibMtqJ5-FVmsVTO6g5rTl8uAVCig2V-nnGu8xTSfF3RnAj1sbsf0zg',
    imageAlt: 'Nexus Pro Fold',
    showMatchBadge: true,
  },
  {
    id: 4,
    title: 'Swift S14 Lite',
    subtitle: 'Lite Series',
    price: '$699',
    rating: '4.0',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApwaGEUUb_zBSeojDQriyg5_GunOhwRGMc3b2t5sqhnw33JjDsDNb8gyNnnY7bF-24E9REHO9sE9iUU4UUULn3O7HQ-3z2mddCmU4DMPp9XXyh6EfMPTUqw1vOq2Ex9Vc08YGOLmIgFm9Bg4VoOJNg6J9Brv0i4h0qmHM6ygMJ1Hm9BzyPRBVREymJOPfb0nBddaJ-n-AUMrnSe7_XqtAq840IaUFjQEoEWQnDItzKTLR4DokdBXqU3rG3eJbrMp-Y4VnrMocQdEk',
    imageAlt: 'Swift S14 Lite',
    showMatchBadge: false,
  },
  {
    id: 5,
    title: 'Titan Shield Ultra',
    subtitle: 'Rugged Pro',
    price: '$849',
    rating: '4.1',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8XlmcJLleJE0K77pm-GUAJwaM7y9siu-GUoOtl4aPZ-mWS6HJ98agNkHGJGdXrPwYtzY8dxk8Zyd-ICufZVkCQ8V_jgTir7TYhYx_y5DyOVtCYnbiw7H5MelHIOy0KFIQraKvY3s2cD7RvWVav0IQl_gXdZFcp01kRPfE-zyh5U0EyP9pGs2vwYcDYigQEnzGnw1Q934z7TAZLlhsuFDBeabLBcSdHqLpBI3KaFKHLQxVfn_6C32HAEi2zjWGjV_1koUZoZP2J3E',
    imageAlt: 'Titan Shield Ultra',
    showMatchBadge: false,
  },
  {
    id: 6,
    title: 'Lumix Vision 5G',
    subtitle: 'Photography Expert',
    price: '$1,299',
    rating: '4.8',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdKnoN62rj5oT6KgcG-X06lRFYiL7rSsMLIQf2biJfPqHJYBfSktTYEG5PVugzIurwhoF1JaPTFTTcpd6W1c8UjmEi1NS20-zazvc8b9X7f4ccHAtF1KyXQoR2pCaDUt46TkBaQoxSwl3dJU4HUW12K7gjk_1czT852ys37pLHo1qN-EeQryY4BAFpvi16uXtWZz6ijEnux4fnIHnr9m8uajkFeCbrZLZb_3WzJ7R7T_ycd8-PFnlPa03ZzUGiK8YD9UtLTgVDV-4',
    imageAlt: 'Lumix Vision 5G',
    showMatchBadge: true,
  },
];

@Injectable({
  providedIn: 'root',
})
export class ProductListingService {
  // === THIS IS THE MISSING LOGIC ===
  // 1. Reactive signal to track selected IDs
  selectedIds = signal<number[]>([]);

  // 2. Logic to add/remove ID from comparison
  toggleComparison(id: number) {
    this.selectedIds.update(current => {
      if (current.includes(id)) {
        return current.filter(itemId => itemId !== id); // Remove
      } else {
        return [...current, id]; // Add
      }
    });
  }

  // 3. Clear logic
  clearComparison() {
    this.selectedIds.set([]);
  }

  // 4. Getter for the comparison page
  getSelectedProducts(): Product[] {
    const ids = this.selectedIds();
    return MASTER_PRODUCTS.filter(p => ids.includes(p.id));
  }
  // =================================

  getTrendingProducts(): Observable<Product[]> {
    const trending = MASTER_PRODUCTS.filter(p => p.id >= 101); 
    return of(trending).pipe(delay(DELAY_MS));
  }

  getProducts(): Observable<Product[]> {
    return of(MASTER_PRODUCTS);
  }

  getProductById(id: number): Observable<Product | undefined> {
    const product = MASTER_PRODUCTS.find((p) => p.id === id);
    return of(product);
  }
}