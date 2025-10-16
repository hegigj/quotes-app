import { computed, inject, Injectable, signal } from '@angular/core';
import { QuoteApi } from '../../core/api/quote-api';
import { StorageConfig } from '../../core/configs/storage.config';
import { StorageService } from '../../core/services/storage.service';
import { IQuote } from '../interfaces/quote.interface';
import { IVote } from '../interfaces/vote.interface';
import { QuotePerTagStore } from '../types/quote-per-tag-store.type';
import { QuoteStore } from '../types/quote-store.type';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private readonly quoteApi: QuoteApi = inject(QuoteApi);
  private readonly storageService: StorageService = inject(StorageService);

  private quotesPerTagMap: Record<string, number> = {};
  private quoteSkipCount: number = 0;

  private readonly _quotes = signal<IQuote[]>([]);
  public readonly quotes = computed(() => this._quotes());

  constructor() {
    this.getQuotesPerTagMap();
  }

  private getQuotesPerTagMap(): void {
    this.quoteApi
      .getTags()
      .subscribe(tags => {
        this.quotesPerTagMap = tags.reduce(
          (acc, tag) => ({ ...acc, [tag.name]: tag.quoteCount }),
          {}
        )
      });
  }

  public loadQuotes(): void {
    let quoteStore = this.storageService.getItem<QuoteStore>(StorageConfig.quote) ?? {};

    const loadQuotes = (page: number): void => {
      this.quoteApi
        .getQuotes({ page, limit: 50 })
        .subscribe(pageOfQuotes => {
          if (page < pageOfQuotes.totalPages) {
            quoteStore = {
              ...quoteStore,
              ...pageOfQuotes.results.reduce(
                (acc, quote) => ({
                  ...acc,
                  [quote._id]: {
                    id: quote._id,
                    author: quote.author,
                    content: quote.content,
                    tags: quote.tags,
                    votes: quoteStore[quote._id]?.votes ?? {
                      upVoteCount: 0,
                      downVoteCount: 0,
                      userVotedUp: [],
                      userVotedDown: []
                    }
                  }
                }),
                {}
              )
            };

            this.storageService.setItem(StorageConfig.quote, quoteStore);

            if (page === 1) this.getQuotes();

            page++;
            loadQuotes(page);
          }
        });
    };

    loadQuotes(1);
  }

  public loadQuotesByTag(tag: string): void {
    let quotesPerTagStore = this.storageService.getItem<QuotePerTagStore>(StorageConfig.quoteByTag) ?? {};
    if (!quotesPerTagStore[tag] || quotesPerTagStore[tag].length === 0) {
      return;
    }

    const quotesPerTag: number = this.quotesPerTagMap[tag];
    if (quotesPerTag <= quotesPerTagStore[tag].length) {
      return;
    }

    const quoteStore = this.storageService.getItem<QuoteStore>(StorageConfig.quote) ?? {};

    const loadQuotesByTag = (page: number): void => {
      this.quoteApi
        .getQuotes({ page, limit: 30, tag })
        .subscribe(pageOfQuotes => {
          if (page <= pageOfQuotes.totalPages) {
            page++;

            quotesPerTagStore = {
              ...quotesPerTagStore,
              [tag]: pageOfQuotes.results.map(quote => ({
                id: quote._id,
                author: quote.author,
                content: quote.content,
                tags: quote.tags,
                votes: quoteStore[quote._id]?.votes ?? {
                  upVoteCount: 0,
                  downVoteCount: 0,
                  userVotedUp: [],
                  userVotedDown: []
                }
              }))
            };

            this.storageService.setItem(StorageConfig.quoteByTag, quotesPerTagStore);

            loadQuotesByTag(page);
          }
        });
    };

    loadQuotesByTag(1);
  }

  public getQuotes(limit: number = 30): void {
    const quoteStore = this.storageService.getItem<QuoteStore>(StorageConfig.quote) ?? {};
    const newQuotes: IQuote[] = [];

    let i: number = 0;
    for (const quoteId in quoteStore) {
      if (i < this.quoteSkipCount * limit) {
        i++
      } else if (i < this.quoteSkipCount * limit + limit) {
        newQuotes.push(quoteStore[quoteId]);
        i++;
      } else {
        break;
      }
    }

    this._quotes.update(quotes => [...quotes, ...newQuotes]);
    this.quoteSkipCount++;
  }

  public getQuotesByTag(tag: string): void {
    const quotesPerTagStore = this.storageService.getItem<QuotePerTagStore>(StorageConfig.quoteByTag) ?? {};

    this.quoteSkipCount = 0;
    this._quotes.set(quotesPerTagStore[tag] ?? []);
  }

  public async vote(vote: IVote): Promise<void> {
    const { quoteId, vote: voteType, user } = vote;

    let quoteStore = (await this.storageService.getItem<QuoteStore>(StorageConfig.quote)) ?? {};
    const quote: IQuote | undefined = quoteStore[quoteId];
    if (quote) {
      switch (voteType) {
        case 'up_vote':
          const userVotedUp = quote.votes.userVotedUp.findIndex(u => u === user);
          if (userVotedUp !== -1) {
            quote.votes.upVoteCount--;
            quote.votes.userVotedUp = quote.votes.userVotedUp.splice(userVotedUp, 1);
            break;
          }
          quote.votes.upVoteCount++;
          quote.votes.userVotedUp.push(user);
          break;
        case 'down_vote':
          const userVotedDown = quote.votes.userVotedDown.findIndex(u => u === user);
          if (userVotedDown !== -1) {
            quote.votes.downVoteCount--;
            quote.votes.userVotedDown = quote.votes.userVotedDown.splice(userVotedDown, 1);
            break;
          }
          quote.votes.downVoteCount++;
          quote.votes.userVotedDown.push(user);
          break;
      }

      quoteStore = { ...quoteStore, [quoteId]: quote };

      await this.storageService.setItem(StorageConfig.quote, quoteStore);

      let quotesPerTagStore = (await this.storageService.getItem<QuotePerTagStore>(StorageConfig.quoteByTag)) ?? {};

      for (const tag of quote.tags) {
        const quotesPerTag = quotesPerTagStore[tag];

        quotesPerTagStore = {
          ...quotesPerTagStore,
          [tag]: quotesPerTag.map(q => {
            if (q.id === quoteId) {
              return quote as IQuote;
            }

            return q;
          })
        };

        await this.storageService.setItem(StorageConfig.quoteByTag, quotesPerTagStore);
      }
    }
  }
}
