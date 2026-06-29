import { Injectable, PLATFORM_ID, afterNextRender, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { StorageService, StorageType } from '@app/core/services/storage.service';
import { OnboardingStateService } from '@app/core/services/onboarding-state.service';
import { PreferenceService } from '@app/core/services/preference.service';
import { tryMapApiPreferencesToOnboardingState } from '@app/core/mappers/preference.mapper';
import { AuthSession, LoginResponse, UserRole } from '@app/core/models/auth-session.model';

const STORAGE_KEY_PREFIX = 'smartcompare_';

const ADMIN_TOKEN_KEY = 'admin_token';
const ADMIN_ROLE_KEY = 'admin_role';
const ADMIN_EMAIL_KEY = 'admin_email';

const CONSUMER_TOKEN_KEY = 'token';
const CONSUMER_ROLE_KEY = 'role';
const CONSUMER_EMAIL_KEY = 'email';

const CONSUMER_AUTH_KEYS = [
  CONSUMER_TOKEN_KEY,
  CONSUMER_ROLE_KEY,
  CONSUMER_EMAIL_KEY,
  'user',
] as const;

const ADMIN_AUTH_KEYS = [ADMIN_TOKEN_KEY, ADMIN_ROLE_KEY, ADMIN_EMAIL_KEY] as const;

interface ConsumerSession {
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly onboardingState = inject(OnboardingStateService);
  private readonly preferenceService = inject(PreferenceService);

  private readonly session = signal<AuthSession | null>(null);
  private readonly consumerSession = signal<ConsumerSession | null>(null);
  private onboardingHydrated = false;

  readonly session$ = this.session.asReadonly();
  readonly isAuthenticated = computed(() => this.session() !== null);
  readonly role = computed(() => this.session()?.role ?? null);
  readonly isAdmin = computed(() => this.session()?.role === 'ADMIN');
  readonly email = computed(() => this.session()?.email ?? null);

  readonly isConsumerLoggedIn = computed(
    () => this.consumerSession() !== null && this.getConsumerToken() !== null,
  );
  readonly consumerEmail = computed(() => this.consumerSession()?.email ?? null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.syncSessionsFromStorage();
    }

    afterNextRender(() => {
      this.syncSessionsFromStorage();
    });
  }

  establishSessionFromLogin(data: LoginResponse, email: string): void {
    // Backend issues a single JWT (24h via security.jwt.expiration); no remember-me option.
    // Persist in localStorage so the session survives tab/browser restarts until the token expires.
    const storageType: StorageType = 'local';

    if (data.role === 'ADMIN') {
      this.onboardingState.resetState();
      this.clearConsumerSession();
      const session: AuthSession = {
        token: data.token,
        tokenType: data.tokenType,
        expiresIn: data.expiresIn,
        role: data.role,
        email,
      };
      this.persistAdminSession(session);
      this.session.set(session);
      return;
    }

    this.clearAdminSession();
    this.session.set(null);
    this.clearConsumerSession();

    if (isPlatformBrowser(this.platformId)) {
      this.storage.setItem(CONSUMER_TOKEN_KEY, data.token, storageType);
      this.storage.setItem(CONSUMER_ROLE_KEY, data.role, storageType);
      this.storage.setItem(CONSUMER_EMAIL_KEY, email, storageType);
      this.removeConsumerSessionStorageCopies();
      this.consumerSession.set({ email });
      this.onboardingHydrated = false;
      this.hydrateOnboardingFromBackend();
    }
  }

  adminLogout(): void {
    this.performHardLogout();
  }

  consumerLogout(): void {
    this.performHardLogout();
  }

  getAdminToken(): string | null {
    return this.session()?.token ?? null;
  }

  getConsumerToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return this.readConsumerTokenFromStorage();
  }

  isConsumerAuthenticated(): boolean {
    return this.isConsumerLoggedIn();
  }

  private performHardLogout(): void {
    this.clearAdminSession();
    this.clearConsumerSession();
    this.onboardingState.resetState();
    this.onboardingHydrated = false;

    this.session.set(null);
    this.consumerSession.set(null);

    void this.router.navigate(['/']);
  }

  private syncSessionsFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.migrateConsumerSessionToLocalStorage();

    const adminSession = this.loadAdminSessionFromStorage();
    if (adminSession) {
      this.session.set(adminSession);
      this.consumerSession.set(null);
      return;
    }

    const consumerSession = this.loadConsumerSessionFromStorage();
    const hadConsumerSession = this.consumerSession() !== null;

    this.session.set(null);
    this.consumerSession.set(consumerSession);

    if (consumerSession && !hadConsumerSession) {
      this.hydrateOnboardingFromBackend();
    }
  }

  private readConsumerTokenFromStorage(): string | null {
    const raw =
      this.storage.getItem<string>(CONSUMER_TOKEN_KEY, 'local') ||
      this.storage.getItem<string>(CONSUMER_TOKEN_KEY, 'session');

    return this.normalizeToken(raw);
  }

  private hydrateOnboardingFromBackend(): void {
    if (this.onboardingHydrated) {
      return;
    }

    this.onboardingHydrated = true;

    forkJoin({
      options: this.preferenceService.getOptions(),
      prefs: this.preferenceService.getPreferences(),
    }).subscribe({
      next: ({ options, prefs }) => {
        const hydrated = tryMapApiPreferencesToOnboardingState(prefs, options);
        if (hydrated) {
          this.onboardingState.hydrateFromSavedPreferences(hydrated);
        }
      },
      error: () => {
        /* keep empty in-memory state when hydration fails */
      },
    });
  }

  private normalizeToken(raw: string | null): string | null {
    if (typeof raw !== 'string') {
      return null;
    }

    const token = raw.trim().replace(/^Bearer\s+/i, '');
    return token.length > 0 ? token : null;
  }

  private persistAdminSession(session: AuthSession): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.storage.setItem(ADMIN_TOKEN_KEY, session.token, 'local');
    this.storage.setItem(ADMIN_ROLE_KEY, session.role, 'local');
    this.storage.setItem(ADMIN_EMAIL_KEY, session.email, 'local');
  }

  private clearAdminSession(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    for (const key of ADMIN_AUTH_KEYS) {
      this.removeAuthKeyEverywhere(key);
    }

    this.session.set(null);
  }

  private clearConsumerSession(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    for (const key of CONSUMER_AUTH_KEYS) {
      this.removeAuthKeyEverywhere(key);
    }

    this.consumerSession.set(null);
  }

  private removeAuthKeyEverywhere(key: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const storageTypes: StorageType[] = ['local', 'session'];
    for (const storageType of storageTypes) {
      this.storage.removeItem(key, storageType);
    }

    const prefixedKey = `${STORAGE_KEY_PREFIX}${key}`;
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
    window.localStorage.removeItem(prefixedKey);
    window.sessionStorage.removeItem(prefixedKey);
  }

  private loadConsumerSessionFromStorage(): ConsumerSession | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    if (!this.readConsumerTokenFromStorage()) {
      return null;
    }

    const email =
      this.storage.getItem<string>(CONSUMER_EMAIL_KEY, 'local') ||
      this.storage.getItem<string>(CONSUMER_EMAIL_KEY, 'session');

    return { email: email ?? 'Account' };
  }

  private removeConsumerSessionStorageCopies(): void {
    for (const key of CONSUMER_AUTH_KEYS) {
      this.storage.removeItem(key, 'session');
    }
  }

  private migrateConsumerSessionToLocalStorage(): void {
    const sessionToken = this.storage.getItem<string>(CONSUMER_TOKEN_KEY, 'session');
    if (!sessionToken) {
      return;
    }

    if (!this.storage.getItem<string>(CONSUMER_TOKEN_KEY, 'local')) {
      this.storage.setItem(CONSUMER_TOKEN_KEY, sessionToken, 'local');

      const role = this.storage.getItem<string>(CONSUMER_ROLE_KEY, 'session');
      const email = this.storage.getItem<string>(CONSUMER_EMAIL_KEY, 'session');

      if (role) {
        this.storage.setItem(CONSUMER_ROLE_KEY, role, 'local');
      }
      if (email) {
        this.storage.setItem(CONSUMER_EMAIL_KEY, email, 'local');
      }
    }

    this.removeConsumerSessionStorageCopies();
  }

  private loadAdminSessionFromStorage(): AuthSession | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const token = this.storage.getItem<string>(ADMIN_TOKEN_KEY, 'local');
    const role = this.storage.getItem<UserRole>(ADMIN_ROLE_KEY, 'local');
    const email = this.storage.getItem<string>(ADMIN_EMAIL_KEY, 'local');

    if (!token || role !== 'ADMIN') {
      return null;
    }

    return {
      token,
      tokenType: 'Bearer',
      expiresIn: 0,
      role,
      email: email ?? '',
    };
  }
}
