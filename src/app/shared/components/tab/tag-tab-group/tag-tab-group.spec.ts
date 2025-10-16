import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagTabGroup } from './tag-tab-group';

describe('TagTabGroup', () => {
  let component: TagTabGroup;
  let fixture: ComponentFixture<TagTabGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagTabGroup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagTabGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
