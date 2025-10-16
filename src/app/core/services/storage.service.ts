import { inject, Injectable } from '@angular/core';
import { EncryptService } from './encrypt.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly encryptService: EncryptService = inject(EncryptService);

  public setItem(key: string, value: any): void {
    const json = JSON.stringify(value);
    const encrypted = this.encryptService.encrypt(json);
    localStorage.setItem(key, encrypted);
  }

  public getItem<TYPE>(key: string): TYPE | null {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;

    const decrypted = this.encryptService.decrypt(encrypted);
    return decrypted ? JSON.parse(decrypted) : null;
  }
}
