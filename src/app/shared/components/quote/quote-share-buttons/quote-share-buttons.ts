import { Component, input } from '@angular/core';
import { IQuote } from '../../../interfaces/quote.interface';

@Component({
  selector: 'quote-share-buttons',
  imports: [],
  templateUrl: './quote-share-buttons.html',
  host: {
    'class': 'flex gap-1'
  },
  standalone: true
})
export class QuoteShareButtons {
  public quote = input.required<IQuote>();

  protected shareInFacebook(): void {
    const encodedUrl = encodeURIComponent(
      `${window.location.origin}/quote/${this.quote().id}`
    );
    const encodedText = encodeURIComponent(
      `${this.quote().content}\n[by: ${this.quote().author}]`
    );
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
    console.log(decodeURIComponent(fbUrl));
    window.open(fbUrl, '_blank', 'width=600,height=400');
  }

  protected shareInX(): void {
    const encodedUrl = encodeURIComponent(
      `${window.location.origin}/quote/${this.quote().id}`
    );
    const encodedText = encodeURIComponent(
      `${this.quote().content}\n[by: ${this.quote().author}]`
    );
    const xUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
    console.log(decodeURIComponent(xUrl));
    window.open(xUrl, '_blank', 'width=600,height=400');
  }
}
