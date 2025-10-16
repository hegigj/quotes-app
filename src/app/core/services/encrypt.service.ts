import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptService {

  public encrypt(value: string): string {
    return btoa(unescape(encodeURIComponent(value)));
  }

  public decrypt(encryptedBase64: string): string {
    return decodeURIComponent(escape(atob(encryptedBase64)));
  }
}
