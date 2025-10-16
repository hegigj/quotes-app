import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from '../configs/api.config';
import { PageOfDto } from '../dto/page-of.dto';
import { QuoteDto } from '../dto/quote.dto';
import { TagDto } from '../dto/tag.dto';
import { IQuoteSearchQuery } from '../interfaces/quote-search-query.interface';

@Injectable({
  providedIn: 'root'
})
export class QuoteApi {
  private readonly httpClient : HttpClient = inject(HttpClient);

  public getQuotes(query: IQuoteSearchQuery): Observable<PageOfDto<QuoteDto>> {
    let params: HttpParams = new HttpParams();
    if (query.page) {
      params = params.append('page', query.page);
    }

    if (query.limit) {
      params = params.append('limit', query.limit);
    }

    if (query.tag) {
      params = params.append('tag', query.tag);
    }

    return this.httpClient.get<PageOfDto<QuoteDto>>(ApiConfig.quotes, { params });
  }

  public getTags(): Observable<TagDto[]> {
    return this.httpClient.get<TagDto[]>(ApiConfig.tags);
  }
}
