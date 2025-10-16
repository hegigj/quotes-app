import { IQuoteVote } from './quote-vote.interface';

export interface IQuote {
  id: string;
  author: string;
  content: string;
  tags: string[];
  votes: IQuoteVote;
}
