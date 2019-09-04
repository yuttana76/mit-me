import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetRegis2Component } from './set-regis2.component';

describe('SetRegis2Component', () => {
  let component: SetRegis2Component;
  let fixture: ComponentFixture<SetRegis2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetRegis2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetRegis2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
