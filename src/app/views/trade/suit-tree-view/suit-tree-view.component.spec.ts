import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuitTreeViewComponent } from './suit-tree-view.component';

describe('SuitTreeViewComponent', () => {
  let component: SuitTreeViewComponent;
  let fixture: ComponentFixture<SuitTreeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuitTreeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuitTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
