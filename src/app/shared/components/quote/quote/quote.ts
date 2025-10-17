import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Component, inject, input } from '@angular/core';
import { filter, tap } from 'rxjs';
import { IQuote } from '../../../interfaces/quote.interface';
import { IUser } from '../../../interfaces/user.interface';
import { QuoteService } from '../../../services/quote.service';
import { UserService } from '../../../services/user.service';
import { VoteType } from '../../../types/vote.type';
import { SignIn } from '../../dialog/sign-in/sign-in';
import { QuoteShareButtons } from '../quote-share-buttons/quote-share-buttons';
import { QuoteTags } from '../quote-tags/quote-tags';
import { QuoteVotes } from '../quote-votes/quote-votes';

@Component({
  selector: 'quote',
  imports: [
    QuoteTags,
    QuoteVotes,
    QuoteShareButtons,
    DialogModule
  ],
  templateUrl: './quote.html',
  host: {
    'class': 'flex flex-col gap-4 p-4 border-b-1 border-slate-200'
  },
  standalone: true
})
export class Quote {
  private readonly dialog: Dialog = inject(Dialog);
  private readonly quoteService: QuoteService = inject(QuoteService);
  private readonly userService: UserService = inject(UserService);

  public quote = input.required<IQuote>();
  public tag = input<string | null>();

  protected user = this.userService.user;

  protected vote(vote: VoteType): void {
    if (this.user() !== null) {
      this.quoteService.vote(
          {
          quoteId: this.quote().id,
          vote,
          user: (this.user() as IUser).user
        },
        this.tag()
      );

      if (vote === 'up_vote') {
        for (const tag of this.quote().tags) {
          this.userService.addTag(tag);
        }
      }
    } else {
      this.dialog.open(SignIn)
        .closed
        .pipe(
          filter(signIn => signIn === true),
          tap(() => this.vote(vote))
        )
        .subscribe();
    }
  }
}
