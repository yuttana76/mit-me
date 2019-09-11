import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetWelcomeComponent } from './set-welcome.component';

describe('SetWelcomeComponent', () => {
  let component: SetWelcomeComponent;
  let fixture: ComponentFixture<SetWelcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetWelcomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
