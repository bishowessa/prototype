import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from '@app/core/services/storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  
  // CRITICAL FIX: Only run storage checks if we are in the browser!
  // Node.js (Server-Side Rendering) does not have localStorage.
  if (isPlatformBrowser(platformId)) {
    const storage = inject(StorageService);
    const token = storage.getItem('token', 'local') || storage.getItem('token', 'session');

    if (token) {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(clonedReq);
    }
  }

  // If no token or running on the server, send request normally
  return next(req);
};
