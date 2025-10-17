import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { IQuote } from '../../shared/interfaces/quote.interface';
import { QuoteService } from '../../shared/services/quote.service';

export const quoteResolver: ResolveFn<IQuote | null> = (route, state) => {
  const router: Router = inject(Router);
  const quoteService: QuoteService = inject(QuoteService)

  if (route.paramMap.has('QUOTE_ID')) {
    const quoteId = route.paramMap.get('QUOTE_ID') as string;
    const quote = quoteService.getQuoteById(quoteId);

    if (quote) {
      return quote;
    }

    router.navigateByUrl(state.url);
    return null;
  }

  router.navigateByUrl(state.url);
  return null;
};
