import { Component, computed, inject, output, signal } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'tag-tab-group',
  imports: [],
  templateUrl: './tag-tab-group.html',
  host: {
    'class': 'flex gap-2 p-4'
  },
  standalone: true
})
export class TagTabGroup {
  private readonly userService: UserService = inject(UserService);

  public select = output<string>();

  protected readonly isUserSignedIn = computed(() => this.userService.user()?.signedIn ?? false);
  protected readonly tabs = computed(() => ['All', ...(this.userService.user()?.tags ?? [])]);
  protected readonly selectedTab = signal<string | null>(null);

  protected selectTab(tab: string): void {
    this.selectedTab.set(tab);
    this.select.emit(tab);
  }
}
