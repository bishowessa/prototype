import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import type { User } from '@app/core/models';

const LOGIN_DELAY_MS = 1000;
const REGISTER_DELAY_MS = 1000;

/** Dummy "invalid" email for simulated login failure */
const INVALID_LOGIN_EMAIL = 'wrong@example.com';

function dummyUser(email: string): User {
  const now = new Date().toISOString();
  return {
    id: 1,
    created_at: now,
    updated_at: now,
    type: 0,
    email,
    password: '',
  };
}

export interface AuthResult {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  login(email: string, password: string): Observable<AuthResult> {
    if (!password.trim() || email.trim().toLowerCase() === INVALID_LOGIN_EMAIL) {
      return throwError(() => new Error('Invalid email or password')).pipe(
        delay(LOGIN_DELAY_MS)
      );
    }
    return of({
      user: dummyUser(email),
      token: `dummy-jwt-${Date.now()}`,
    }).pipe(delay(LOGIN_DELAY_MS));
  }

  register(email: string, password: string): Observable<AuthResult> {
    if (!password.trim() || password.length < 6) {
      return throwError(
        () => new Error('Password must be at least 6 characters')
      ).pipe(delay(REGISTER_DELAY_MS));
    }
    return of({
      user: dummyUser(email),
      token: `dummy-jwt-${Date.now()}`,
    }).pipe(delay(REGISTER_DELAY_MS));
  }
}
