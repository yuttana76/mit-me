import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FcIndCustomerComponent } from './fc-ind-customer.component';

describe('FcIndCustomerComponent', () => {
  let component: FcIndCustomerComponent;
  let fixture: ComponentFixture<FcIndCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FcIndCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FcIndCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
