import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildrenDialogComponent } from './children-dialog.component';

describe('ChildrenDialogComponent', () => {
  let component: ChildrenDialogComponent;
  let fixture: ComponentFixture<ChildrenDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildrenDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildrenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
