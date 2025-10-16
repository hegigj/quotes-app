import { BaseDto } from './base.dto';

export interface TagDto extends BaseDto {
  name: string;
  slug: string;
  quoteCount: number;
}
