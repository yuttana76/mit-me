import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryRepComponent } from './summary-rep.component';

describe('SummaryRepComponent', () => {
  let component: SummaryRepComponent;
  let fixture: ComponentFixture<SummaryRepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryRepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryRepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
