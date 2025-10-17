import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { tap } from 'rxjs';
import { HeaderOptions } from '../../shared/components/header-options/header-options';
import { Quote } from '../../shared/components/quote/quote/quote';
import { IQuote } from '../../shared/interfaces/quote.interface';

@Component({
  selector: 'quotes-detail',
  imports: [
    HeaderOptions,
    RouterLink,
    Quote,
  ],
  templateUrl: './quotes-detail.html',
  standalone: true
})
export class QuotesDetail implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  protected quote = signal<IQuote>({
    id: '',
    author: '',
    content: '',
    tags: [],
    votes: {
      upVoteCount: 0,
      userVotedUp: [],
      downVoteCount: 0,
      userVotedDown: []
    }
  });

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(
        tap(({quote}) => this.quote.set(quote)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
