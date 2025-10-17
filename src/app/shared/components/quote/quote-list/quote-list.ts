import { Component, DestroyRef, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, fromEvent, tap } from 'rxjs';
import { QuoteService } from '../../../services/quote.service';
import { Quote } from '../quote/quote';

@Component({
  selector: 'quote-list',
  imports: [
    Quote
  ],
  templateUrl: './quote-list.html',
  host: {
    'class': 'h-dvh'
  },
  standalone: true
})
export class QuoteList implements OnInit, OnChanges {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly quoteService: QuoteService = inject(QuoteService);

  @Input()
  public tab: string | null = null;

  protected quotes = this.quoteService.quotes;

  ngOnInit(): void {
    this.quoteService.loadQuotes();

    fromEvent(document, 'scroll')
      .pipe(
        debounceTime(100),
        tap(() => this.onScroll()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['tab'].currentValue !== null &&
      changes['tab'].currentValue !== changes['tab'].previousValue
    ) {
      console.log('[QuoteList]: ngOnChanges()', this.tab)
      this.quoteService.loadQuotesByTag(this.tab as string);
    }
  }

  private onScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.body.offsetHeight;

    if (scrollPosition >= pageHeight - 50) {
      if (this.tab === null) {
        this.quoteService.getQuotes();
      } else {
        this.quoteService.getQuotesByTag(this.tab);
      }
    }
  }
}
