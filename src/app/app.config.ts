import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'; 
import { routes } from '@app/app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

// Make sure this path exactly matches where you put the file!
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    
    // Combined into a single provideHttpClient call
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    )
  ]
};