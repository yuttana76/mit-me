import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedInspCustDetailComponent } from './led-insp-cust-detail.component';

describe('LedInspCustDetailComponent', () => {
  let component: LedInspCustDetailComponent;
  let fixture: ComponentFixture<LedInspCustDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedInspCustDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedInspCustDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
