import { Component, input } from '@angular/core';

@Component({
  selector: 'quote-tags',
  imports: [],
  templateUrl: './quote-tags.html',
  host: {
    'class': 'flex gap-1'
  },
  standalone: true
})
export class QuoteTags {
  public tags = input.required<string[]>();
}
