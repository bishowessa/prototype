import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Adjust interfaces based on your exact Spring Boot response
export interface AuthResponse {
  token: string;
  user?: any; 
}

export interface PreferencePayload {
  productCategoryId: number; // e.g., 1 for Phone, 2 for Laptop
  preferences: string;       // JSON stringified object
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1'; // Adjust if auth is not under /api/v1

  register(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, { email, password }).pipe(
      // Unwraps ApiResponse if your backend uses it, otherwise just returns the response
      map(res => res.data ? res.data : res) 
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      map(res => res.data ? res.data : res)
    );
  }

  savePreferences(payload: PreferencePayload[]): Observable<any> {
    // Because the interceptor is active, this request will automatically include the Bearer token!
    return this.http.post(`${this.apiUrl}/preferences`, payload);
  }
}