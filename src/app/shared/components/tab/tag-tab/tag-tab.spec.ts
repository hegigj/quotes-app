import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagTab } from './tag-tab';

describe('TagTab', () => {
  let component: TagTab;
  let fixture: ComponentFixture<TagTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
