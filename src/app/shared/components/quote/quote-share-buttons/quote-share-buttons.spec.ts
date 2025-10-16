import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteShareButtons } from './quote-share-buttons';

describe('QuoteShareButtons', () => {
  let component: QuoteShareButtons;
  let fixture: ComponentFixture<QuoteShareButtons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteShareButtons]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoteShareButtons);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
