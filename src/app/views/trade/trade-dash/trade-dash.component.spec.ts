import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeDashComponent } from './trade-dash.component';

describe('TradeDashComponent', () => {
  let component: TradeDashComponent;
  let fixture: ComponentFixture<TradeDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
