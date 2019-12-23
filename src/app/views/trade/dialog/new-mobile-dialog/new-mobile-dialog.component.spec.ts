import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMobileDialogComponent } from './new-mobile-dialog.component';

describe('NewMobileDialogComponent', () => {
  let component: NewMobileDialogComponent;
  let fixture: ComponentFixture<NewMobileDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMobileDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMobileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
