import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotesDetail } from './quotes-detail';

describe('QuotesDetail', () => {
  let component: QuotesDetail;
  let fixture: ComponentFixture<QuotesDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuotesDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotesDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
