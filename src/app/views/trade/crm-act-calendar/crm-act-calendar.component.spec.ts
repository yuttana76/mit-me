import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmActCalendarComponent } from './crm-act-calendar.component';

describe('CrmActCalendarComponent', () => {
  let component: CrmActCalendarComponent;
  let fixture: ComponentFixture<CrmActCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmActCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmActCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
