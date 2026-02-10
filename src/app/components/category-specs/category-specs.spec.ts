import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySpecs } from './category-specs';

describe('CategorySpecs', () => {
  let component: CategorySpecs;
  let fixture: ComponentFixture<CategorySpecs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorySpecs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorySpecs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
