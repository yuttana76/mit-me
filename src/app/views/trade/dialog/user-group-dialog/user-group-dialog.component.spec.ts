import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGroupDialogComponent } from './user-group-dialog.component';

describe('UserGroupDialogComponent', () => {
  let component: UserGroupDialogComponent;
  let fixture: ComponentFixture<UserGroupDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserGroupDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
