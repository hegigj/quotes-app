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

    const quotesPerTag: number = this.quotesPerTagMap[tag];
    if (quotesPerTag <= (quotesPerTagStore[tag]?.length ?? 0)) {
      return;
    }

    const quoteStore = this.storageService.getItem<QuoteStore>(StorageConfig.quote) ?? {};

    const loadQuotesByTag = (page: number): void => {
      this.quoteApi
        .getQuotes({ page, limit: 50, tag })
        .subscribe(pageOfQuotes => {
          if (page < pageOfQuotes.totalPages) {
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

            if (page === 1) this.getQuotesByTag(tag);

            page++;
            loadQuotesByTag(page);
          }
        });
    };

    loadQuotesByTag(1);
  }

  public getQuotes(limit: number = 30, update: boolean = true): void {
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

    if (update) {
      this._quotes.update(quotes => [...quotes, ...newQuotes]);
    } else {
      this._quotes.set(newQuotes);
    }

    this.quoteSkipCount++;
  }

  public getQuotesByTag(tag: string): void {
    this.quoteSkipCount = 0;

    if (tag === 'All') {
      this._quotes.set([]);
      this.getQuotes();
      return;
    }

    const quotesPerTagStore = this.storageService.getItem<QuotePerTagStore>(StorageConfig.quoteByTag) ?? {};

    if (!quotesPerTagStore[tag] || quotesPerTagStore[tag].length === 0) {
      this.loadQuotesByTag(tag);
    }

    this._quotes.set(quotesPerTagStore[tag] ?? []);
  }

  public getQuoteById(id: string): IQuote | null {
    const quoteStore = this.storageService.getItem<QuoteStore>(StorageConfig.quote) ?? {};
    return quoteStore[id] ?? null;
  }

  public vote(vote: IVote, tag: string | null = null): void {
    const { quoteId, vote: voteType, user } = vote;

    let quoteStore = this.storageService.getItem<QuoteStore>(StorageConfig.quote) ?? {};
    const quote: IQuote | undefined = quoteStore[quoteId];

    if (quote) {
      const userVotedUp = quote.votes.userVotedUp.findIndex(u => u === user);
      const userVotedDown = quote.votes.userVotedDown.findIndex(u => u === user);

      switch (voteType) {
        case 'up_vote':
          if (userVotedUp !== -1) {
            quote.votes.upVoteCount--;
            quote.votes.userVotedUp.splice(userVotedUp, 1);
          } else {
            quote.votes.upVoteCount++;
            quote.votes.userVotedUp.push(user);
            if (userVotedDown !== -1) {
              quote.votes.downVoteCount--;
              quote.votes.userVotedDown.splice(userVotedDown, 1);
            }
          }
          break;
        case 'down_vote':
          if (userVotedDown !== -1) {
            quote.votes.downVoteCount--;
            quote.votes.userVotedDown.splice(userVotedDown, 1);
            break;
          } else {
            quote.votes.downVoteCount++;
            quote.votes.userVotedDown.push(user);
            if (userVotedUp !== -1) {
              quote.votes.upVoteCount--;
              quote.votes.userVotedUp.splice(userVotedUp, 1);
            }
          }
          break;
      }

      this.storageService.setItem(StorageConfig.quote, quoteStore);

      let quotesPerTagStore = this.storageService.getItem<QuotePerTagStore>(StorageConfig.quoteByTag) ?? {};
      for (const tag of quote.tags) {
        const quotesPerTag = quotesPerTagStore[tag];

        if (quotesPerTag) {
          quotesPerTagStore = {
            ...quotesPerTagStore,
            [tag]: quotesPerTag.map(q => {
              if (q.id === quoteId) {
                return quote;
              }

              return q;
            })
          };
        } else {
          quotesPerTagStore = {
            ...quotesPerTagStore,
            [tag]: [quote]
          };
        }

        this.storageService.setItem(StorageConfig.quoteByTag, quotesPerTagStore);
      }

      if (tag !== null) {
        this.getQuotesByTag(tag);
      } else {
        console.log('[QuoteService]: vote()', tag, vote.vote, quote);
        const limit = this.quotes().length;
        this._quotes.set([]);

        this.getQuotes(limit, false);
      }
    }
  }
}
