import { Routes } from '@angular/router';
import { quoteResolver } from './core/resolvers/quote-resolver';
import { QuotesDetail } from './page/quotes-detail/quotes-detail';
import { Quotes } from './page/quotes/quotes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'quote',
    pathMatch: 'full'
  },
  {
    path: 'quote',
    children: [
      {
        path: '',
        component: Quotes
      },
      {
        path: ':QUOTE_ID',
        component: QuotesDetail,
        resolve: {
          quote: quoteResolver
        }
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'quote',
    pathMatch: 'full'
  }
];
