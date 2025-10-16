import { BaseDto } from './base.dto';

export interface QuoteDto extends BaseDto {
  content: string;
  length: number;
  author: string;
  authorSlug: string;
  tags: string[];
}
