import { computed, inject, Injectable, signal } from '@angular/core';
import { StorageConfig } from '../../core/configs/storage.config';
import { StorageService } from '../../core/services/storage.service';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly storageService: StorageService = inject(StorageService);

  public readonly _user = signal<IUser | null>(null);
  public readonly user = computed(() => this._user());

  public singIn(email: string): void {
    let users = this.storageService.getItem<IUser[]>(StorageConfig.user) ?? [];

    const userIndex = users.findIndex(u => u.user === email);
    if (userIndex !== -1) {
      this._user.set({
        ...users[userIndex],
        signedIn: true
      });

      users = users.splice(userIndex, 1, this.user() as IUser);
    } else {
      this._user.set({
        user: email,
        tags: [],
        signedIn: true
      });

      users.push(this._user() as IUser);
    }

    this.storageService.setItem(StorageConfig.user, users);
  }

  public signOut(email: string): void {
    let users = this.storageService.getItem<IUser[]>(StorageConfig.user) ?? [];

    const userIndex = users.findIndex(u => u.user === email);
    if (userIndex !== -1) {
      users = users.splice(userIndex, 1, {
        ...users[userIndex],
        signedIn: false
      });

      this._user.set(null);
    }
  }

  public addTag(tag: string): void {
    if (this.user() !== null) {
      let users = this.storageService.getItem<IUser[]>(StorageConfig.user) ?? [];

      let tags = this.user()?.tags ?? [];
      const tagSet = new Set(tags);
      tagSet.add(tag);
      if (tags.length >= 10 && tagSet.size >= tags.length) {
        tagSet.delete(tags.shift() as string);
      }
      tags = Array.from(tagSet);

      this._user.update(user => ({ ...(user as IUser), tags }));

      const userIndex = users.findIndex(u => u.user === this.user()?.user);
      if (userIndex !== -1) {
        users = users.splice(userIndex, 1, this.user() as IUser);

        this.storageService.setItem(StorageConfig.user, users);
      }
    }
  }
}
