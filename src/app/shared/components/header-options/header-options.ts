import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { IUser } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { SignIn } from '../dialog/sign-in/sign-in';

@Component({
  selector: 'header-options',
  imports: [DialogModule],
  templateUrl: './header-options.html',
  host: {
    'class': 'flex items-center gap-2'
  },
  standalone: true
})
export class HeaderOptions implements AfterViewInit {
  private readonly dialog: Dialog = inject(Dialog);
  private readonly userService: UserService = inject(UserService);
  protected isLight = signal<boolean>(true);
  protected user = this.userService.user;

  ngAfterViewInit(): void {
    const body = document.querySelector('body');

    if (body instanceof HTMLBodyElement && body.classList.contains('dark')) {
      this.isLight.set(false);
    }
  }

  protected switchMode(): void {
    const body = document.querySelector('body');

    if (body instanceof HTMLBodyElement) {
      if (this.isLight()) {
        this.isLight.set(false);
        body.classList.add('dark');
      } else {
        this.isLight.set(true);
        body.classList.remove('dark');
      }
    }
  }

  protected signIn(): void {
    this.dialog.open(SignIn).closed.subscribe();
  }

  protected signOut(): void {
    if (this.user() !== null) {
      this.userService.signOut((this.user() as IUser).user);
    }
  }
}
