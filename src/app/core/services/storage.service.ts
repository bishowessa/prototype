import { Injectable } from '@angular/core';

const KEY_PREFIX = 'smartcompare_';

export type StorageType = 'local' | 'session';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private prefix(key: string): string {
    return `${KEY_PREFIX}${key}`;
  }

  private getStorage(type: StorageType): Storage {
    if (typeof window === 'undefined') {
      throw new Error('Storage is only available in the browser');
    }
    return type === 'session' ? window.sessionStorage : window.localStorage;
  }

  getItem<T>(key: string, type: StorageType = 'local'): T | null {
    const raw = this.getStorage(type).getItem(this.prefix(key));
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  }

  setItem<T>(key: string, value: T, type: StorageType = 'local'): void {
    const serialized =
      typeof value === 'string' ? value : JSON.stringify(value);
    this.getStorage(type).setItem(this.prefix(key), serialized);
  }

  removeItem(key: string, type: StorageType = 'local'): void {
    this.getStorage(type).removeItem(this.prefix(key));
  }

  clear(type?: StorageType): void {
    if (type) {
      const storage = this.getStorage(type);
      const keys: string[] = [];
      for (let i = 0; i < storage.length; i++) {
        const k = storage.key(i);
        if (k?.startsWith(KEY_PREFIX)) keys.push(k);
      }
      keys.forEach((k) => storage.removeItem(k));
    } else {
      this.clear('local');
      this.clear('session');
    }
  }
}
