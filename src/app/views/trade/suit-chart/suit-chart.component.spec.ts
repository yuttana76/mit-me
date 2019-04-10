import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuitChartComponent } from './suit-chart.component';

describe('SuitChartComponent', () => {
  let component: SuitChartComponent;
  let fixture: ComponentFixture<SuitChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuitChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuitChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
