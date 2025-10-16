import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteVotes } from './quote-votes';

describe('QuoteVotes', () => {
  let component: QuoteVotes;
  let fixture: ComponentFixture<QuoteVotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteVotes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoteVotes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
