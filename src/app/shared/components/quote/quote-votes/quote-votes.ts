import { Component, computed, input, output } from '@angular/core';
import { IQuoteVote } from '../../../interfaces/quote-vote.interface';
import { IUser } from '../../../interfaces/user.interface';
import { VoteType } from '../../../types/vote.type';

@Component({
  selector: 'quote-votes',
  imports: [],
  templateUrl: './quote-votes.html',
  host: {
    'class': 'flex align-center justify-center divide-x-1 divide-solid divide-slate-500'
  },
  standalone: true
})
export class QuoteVotes {
  public user = input.required<IUser | null>();
  public quoteVotes = input.required<IQuoteVote>();

  public vote = output<VoteType>();

  protected readonly upVoteCount = computed(() => this.quoteVotes().upVoteCount);
  protected readonly downVoteCount = computed(() => this.quoteVotes().downVoteCount);

  protected readonly upVoted = computed(() => {
    if (this.user() !== null) {
      return this.quoteVotes().userVotedUp.findIndex(user => user === (this.user() as IUser).user) !== -1;
    }

    return false;
  });

  protected readonly downVoted = computed(() => {
    if (this.user() !== null) {
      return this.quoteVotes().userVotedDown.findIndex(user => user === (this.user() as IUser).user) !== -1;
    }

    return false;
  });

  protected voteQuote(vote: VoteType): void {
    this.vote.emit(vote);
  }
}
