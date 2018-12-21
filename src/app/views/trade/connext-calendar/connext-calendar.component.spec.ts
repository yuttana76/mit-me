import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnextCalendarComponent } from './connext-calendar.component';

describe('ConnextCalendarComponent', () => {
  let component: ConnextCalendarComponent;
  let fixture: ComponentFixture<ConnextCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnextCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnextCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
