import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FcInvesCompDialogComponent } from './fc-inves-comp-dialog.component';

describe('FcInvesCompDialogComponent', () => {
  let component: FcInvesCompDialogComponent;
  let fixture: ComponentFixture<FcInvesCompDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FcInvesCompDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FcInvesCompDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
