import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLevelDialogComponent } from './user-level-dialog.component';

describe('UserLevelDialogComponent', () => {
  let component: UserLevelDialogComponent;
  let fixture: ComponentFixture<UserLevelDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLevelDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLevelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
