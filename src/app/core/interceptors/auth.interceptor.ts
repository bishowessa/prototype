import { HttpInterceptorFn } from '@angular/common/http';

import { inject, PLATFORM_ID } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import { AuthStateService } from '@app/core/services/auth-state.service';



export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const platformId = inject(PLATFORM_ID);



  if (!isPlatformBrowser(platformId)) {

    return next(req);

  }



  const authState = inject(AuthStateService);

  const isAdminRequest = req.url.includes('/admin/');

  const token = isAdminRequest

    ? authState.getAdminToken()

    : authState.getConsumerToken();



  if (!token) {

    return next(req);

  }



  return next(

    req.clone({

      setHeaders: {

        Authorization: `Bearer ${token}`,

      },

    }),

  );

};

