import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'sign-in',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './sign-in.html',
  host: {
    'class': 'flex flex-col gap-4 p-8 bg-cyan-900 text-slate-100 rounded-md'
  },
  standalone: true
})
export class SignIn {
  private readonly dialogRef: DialogRef = inject(DialogRef);
  private readonly userService: UserService = inject(UserService);

  protected emailControl = new FormControl<string | null>(null, [Validators.required, Validators.email]);

  protected signIn(): void {
    if (this.emailControl.valid) {
      this.userService.singIn(this.emailControl.value as string);
      this.dialogRef.close(true);
    }
  }
}
