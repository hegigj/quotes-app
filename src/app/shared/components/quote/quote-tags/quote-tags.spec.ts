import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteTags } from './quote-tags';

describe('QuoteTags', () => {
  let component: QuoteTags;
  let fixture: ComponentFixture<QuoteTags>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteTags]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoteTags);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
