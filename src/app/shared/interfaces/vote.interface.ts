import { VoteType } from '../types/vote.type';

export interface IVote {
  quoteId: string;
  user: string;
  vote: VoteType;
}
