import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptService {

  public encrypt(value: string): string {
    if (isDevMode()) {
      return value;
    }
    return btoa(unescape(encodeURIComponent(value)));
  }

  public decrypt(encryptedBase64: string): string {
    if (isDevMode()) {
      return encryptedBase64;
    }
    return decodeURIComponent(escape(atob(encryptedBase64)));
  }
}
