import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAuthorityDialogComponent } from './add-authority-dialog.component';

describe('AddAuthorityDialogComponent', () => {
  let component: AddAuthorityDialogComponent;
  let fixture: ComponentFixture<AddAuthorityDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAuthorityDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAuthorityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
