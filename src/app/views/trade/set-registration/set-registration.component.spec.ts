import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetRegistrationComponent } from './set-registration.component';

describe('SetRegistrationComponent', () => {
  let component: SetRegistrationComponent;
  let fixture: ComponentFixture<SetRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
