import { Routes } from '@angular/router';
import { Quotes } from './page/quotes/quotes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'quote',
    pathMatch: 'full'
  },
  {
    path: 'quote',
    component: Quotes
  },
  {
    path: '**',
    redirectTo: 'quote',
    pathMatch: 'full'
  }
];
