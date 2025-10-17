import { Component, signal } from '@angular/core';
import { HeaderOptions } from '../../shared/components/header-options/header-options';
import { QuoteList } from '../../shared/components/quote/quote-list/quote-list';
import { TagTabGroup } from '../../shared/components/tag-tab-group/tag-tab-group';

@Component({
  selector: 'quotes',
  imports: [
    HeaderOptions,
    QuoteList,
    TagTabGroup
  ],
  templateUrl: './quotes.html',
  standalone: true
})
export class Quotes {
  protected readonly selectedTab = signal<string | null>(null);

  protected onSelectTab(tab: string): void {
    this.selectedTab.set(tab);
  }
}
