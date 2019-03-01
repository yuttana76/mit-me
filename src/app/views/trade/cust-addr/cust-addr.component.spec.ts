import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustAddrComponent } from './cust-addr.component';

describe('CustAddrComponent', () => {
  let component: CustAddrComponent;
  let fixture: ComponentFixture<CustAddrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustAddrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustAddrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
