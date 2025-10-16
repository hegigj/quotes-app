import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderOptions } from './header-options';

describe('HeaderOptions', () => {
  let component: HeaderOptions;
  let fixture: ComponentFixture<HeaderOptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderOptions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderOptions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
