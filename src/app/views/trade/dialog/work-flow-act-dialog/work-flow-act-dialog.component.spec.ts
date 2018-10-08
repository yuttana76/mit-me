import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowActDialogComponent } from './work-flow-act-dialog.component';

describe('WorkFlowActDialogComponent', () => {
  let component: WorkFlowActDialogComponent;
  let fixture: ComponentFixture<WorkFlowActDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkFlowActDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkFlowActDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
